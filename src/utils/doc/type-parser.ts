import path from 'node:path';
import type { TypeLiteralNode } from 'ts-morph';
import { Node, Project, SyntaxKind } from 'ts-morph';
import type { FlatPropertyMeta, PropertyMeta, TypeMeta } from './type-resolver.js';

export class TypeParser {
  parseTypesFromFile(filename: string): Record<string, TypeMeta> {
    const filePath = path.resolve(filename);
    const typeMap = this._parseInitialTypes(filePath);
    const analysis = this._analyzeTypeDependencies(typeMap);

    // console.log('Independent types:', analysis.independentTypes);
    // console.log('Dependent types:', analysis.dependentTypes);
    // console.log('Circular dependencies:', analysis.circularDependencies);

    const typeMetaMap = this._resolveTypesInOptimalOrder(typeMap, analysis);
    // console.log(typeMetaMap['CommonPathProperties<T>']);
    return typeMetaMap;
  }

  private _parseInitialTypes(filePath: string): Record<string, TypeMeta> {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(filePath);

    // Retrieve all exported types
    const typeAliases = sourceFile.getTypeAliases().filter((t) => t.isExported());
    const typeMap: Record<string, TypeMeta> = {};

    for (const typeAlias of typeAliases) {
      // typeAlias.get
      const name = typeAlias.getName();
      const comment = typeAlias
        .getJsDocs()
        .map((doc) => doc.getComment())
        .filter((text): text is string => typeof text === 'string')
        .join('\n');

      const typeParams = typeAlias.getTypeParameters().map((tp) => tp.getText());
      const fullName = typeParams.length ? `${name}<${typeParams.join(', ')}>` : name;

      const typeNode = typeAlias.getTypeNode();
      let baseTypesText: string | undefined;
      let objectTypeNode: TypeLiteralNode | undefined;

      if (typeNode) {
        if (typeNode.getKind() === SyntaxKind.IntersectionType) {
          const baseTypeNames: string[] = [];
          const intersectionTypes = typeNode.asKind(SyntaxKind.IntersectionType)?.getTypeNodes() ?? [];
          intersectionTypes.forEach((child) => {
            if (Node.isTypeLiteral(child)) {
              objectTypeNode = child;
            } else {
              baseTypeNames.push(child.getText());
            }
          });
          if (baseTypeNames.length > 0) {
            baseTypesText = baseTypeNames.join(' & ');
          }
        } else if (typeNode.getKind() === SyntaxKind.UnionType) {
          // Handle union types
          baseTypesText = typeNode.getText();
        } else if (Node.isTypeLiteral(typeNode)) {
          objectTypeNode = typeNode;
        } else if (Node.isTypeReference(typeNode) || Node.isExpressionWithTypeArguments(typeNode)) {
          baseTypesText = typeNode.getText();
        }
      }

      const properties: PropertyMeta[] = [];
      if (objectTypeNode) {
        const parseProperties = (node: TypeLiteralNode, targetList: PropertyMeta[]) => {
          node.forEachChild((child) => {
            if (Node.isPropertySignature(child) || Node.isMethodSignature(child)) {
              const propName = child.getName();
              const optional = child.hasQuestionToken?.() ?? false;
              let propTypeText: string;
              let isFunc = false;
              let nestedProps: PropertyMeta[] | undefined;

              if (Node.isPropertySignature(child)) {
                const propTypeNode = child.getTypeNode();
                if (propTypeNode) {
                  propTypeText = propTypeNode.getText();
                  if (propTypeNode.getKind() === SyntaxKind.FunctionType) {
                    isFunc = true;
                  } else if (Node.isTypeLiteral(propTypeNode)) {
                    nestedProps = [];
                    parseProperties(propTypeNode, nestedProps);
                  }
                } else {
                  propTypeText = child.getType().getText();
                }
              } else {
                isFunc = true;
                const params = child
                  .getParameters()
                  .map((p) => p.getText())
                  .join(', ');
                const returnTypeNode = child.getReturnTypeNode();
                const returnTypeText = returnTypeNode ? returnTypeNode.getText() : child.getReturnType().getText();
                propTypeText = `(${params}) => ${returnTypeText}`;
              }
              const comment = child
                .getJsDocs()
                .map((doc) => doc.getComment())
                .filter((text): text is string => typeof text === 'string')
                .join('\n');

              const propMeta: PropertyMeta = {
                name: propName,
                optional: optional,
                datatype: propTypeText,
                isFunction: isFunc,
                comment: comment,
              };
              if (nestedProps) {
                propMeta.properties = nestedProps;
              }
              targetList.push(propMeta);
            }
          });
        };
        parseProperties(objectTypeNode, properties);
      }

      typeMap[fullName] = {
        name: fullName,
        extends: baseTypesText,
        comment: comment,
        properties: properties,
        traversed: false,
        inherited: {},
        flatProperties: [],
      };
    }
    return typeMap;
  }

  private _analyzeTypeDependencies(typeMap: Record<string, TypeMeta>) {
    const dependencyGraph: Record<string, string[]> = {};
    const reverseGraph: Record<string, string[]> = {};
    const typesWithNoExtends: string[] = [];
    const typesWithExtends: string[] = [];
    const circularDeps = new Set<string>();

    // Build dependency graphs
    for (const [typeName, typeMeta] of Object.entries(typeMap)) {
      if (!typeMeta.extends) {
        typesWithNoExtends.push(typeName);
        continue;
      }

      typesWithExtends.push(typeName);
      const dependencies = typeMeta.extends.split(/\s*[|&]\s*/);
      dependencyGraph[typeName] = dependencies;

      for (const dep of dependencies) {
        if (!reverseGraph[dep]) reverseGraph[dep] = [];
        reverseGraph[dep].push(typeName);
      }
    }

    // Detect circular dependencies
    const checkCircular = (type: string, path: string[] = []): boolean => {
      if (path.includes(type)) {
        path.slice(path.indexOf(type)).forEach((t) => circularDeps.add(t));
        return true;
      }
      if (!dependencyGraph[type]) return false;

      const newPath = [...path, type];
      return dependencyGraph[type].some((dep) => checkCircular(dep, newPath));
    };

    typesWithExtends.forEach((type) => checkCircular(type));

    return {
      independentTypes: typesWithNoExtends,
      dependentTypes: typesWithExtends,
      dependencyGraph,
      reverseGraph,
      circularDependencies: Array.from(circularDeps),
    };
  }

  private _resolveTypesInOptimalOrder(typeMap: Record<string, TypeMeta>, analysis: ReturnType<typeof this._analyzeTypeDependencies>) {
    const resolved = new Set<string>(analysis.independentTypes);
    const resolutionOrder: string[] = [...analysis.independentTypes];

    // Process types in waves based on dependency depth
    let currentWave = [...analysis.independentTypes];
    let nextWave: string[] = [];

    while (currentWave.length > 0) {
      for (const resolvedType of currentWave) {
        // Get types that depend on this resolved type
        const dependents = analysis.reverseGraph[resolvedType] || [];

        for (const dependent of dependents) {
          // Check if all dependencies are resolved
          const allDepsResolved = analysis.dependencyGraph[dependent].every((dep) => resolved.has(dep));

          if (allDepsResolved && !resolved.has(dependent)) {
            resolved.add(dependent);
            nextWave.push(dependent);
            resolutionOrder.push(dependent);
          }
        }
      }

      currentWave = nextWave;
      nextWave = [];
    }

    // Handle circular dependencies (if any)
    for (const circularType of analysis.circularDependencies) {
      if (!resolved.has(circularType)) {
        resolutionOrder.push(circularType);
        resolved.add(circularType);
      }
    }

    // Now resolve in optimal order
    for (const typeName of resolutionOrder) {
      const type = typeMap[typeName];
      if (!type.extends) continue;

      const baseTypes = type.extends.split(/\s*[|&]\s*/);
      let resolvedProperties: PropertyMeta[] = [...type.properties];

      for (const baseType of baseTypes) {
        const baseProperties = typeMap[baseType]?.properties || [];

        if (type.extends.includes('&')) {
          type.inheritanceType = '&';
          // Intersection: merge properties
          // resolvedProperties = mergeProperties(type.name, resolvedProperties, baseProperties);
        } else if (type.extends.includes('|')) {
          type.inheritanceType = '|';
          // Union: mark properties as optional
          // const optionalBaseProps = baseProperties.map((p) => ({
          //   ...p,
          //   optional: true,
          // }));
          // resolvedProperties = mergeProperties(type.name, resolvedProperties, optionalBaseProps);
        }
        type.inherited[baseType] = { name: baseType, properties: baseProperties };

        if (type.extends.includes('&')) {
          // Intersection: merge properties
          resolvedProperties = this._mergeProperties(resolvedProperties, baseProperties);
        } else if (type.extends.includes('|')) {
          // Union: mark properties as optional
          const optionalBaseProps = baseProperties.map((p) => ({
            ...p,
            optional: true,
          }));
          resolvedProperties = this._mergeProperties(resolvedProperties, optionalBaseProps);
        }
      }

      type.properties = resolvedProperties;
    }

    for (const typeName in typeMap) {
      typeMap[typeName].flatProperties = this._flattenProperties(typeName, typeMap);
    }

    return typeMap;
  }

  private _mergeProperties(existing: PropertyMeta[], newProps: PropertyMeta[]): PropertyMeta[] {
    const merged = [...existing];
    const existingNames = new Set(existing.map((p) => p.name));

    for (const newProp of newProps) {
      if (!existingNames.has(newProp.name)) {
        merged.push(newProp);
      } else {
        // Merge if needed (e.g., combine documentation)
        const existingProp = existing.find((p) => p.name === newProp.name)!;
        // Custom merge logic here if needed
        // Simple merge logic:
        // console.log('### MERGING', type);
        // console.log('existing', existingProp);
        // console.log('new', newProp);
        merged[merged.indexOf(existingProp)] = {
          // Keep existing values unless new values are more specific
          name: newProp.name,
          optional: existingProp.optional && newProp.optional, // Only required if both are required
          datatype: newProp.datatype !== 'any' ? newProp.datatype : existingProp.datatype, // Prefer more specific type
          isFunction: existingProp.isFunction || newProp.isFunction,
          properties:
            existingProp.properties && newProp.properties
              ? this._mergeProperties(existingProp.properties, newProp.properties)
              : existingProp.properties || newProp.properties,
          comment: newProp.comment || existingProp.comment, // Prefer new comment if exists
        };
      }
    }

    return merged;
  }

  private _flattenProperties(typeName: string, typeMap: Record<string, TypeMeta>, visited = new Set<string>()): FlatPropertyMeta[] {
    if (visited.has(typeName)) {
      console.error('already visited', typeName);
      return [];
    }
    visited.add(typeName);

    const typeMeta = typeMap[typeName];
    if (!typeMeta) return [];

    // const flatPropsMap: Record<string, FlatPropertyMeta> = {};

    // Add direct properties first
    const flatPropsMap = this._createWithDirectProps(typeMeta);

    // Process extended types
    if (typeMeta.extends) {
      const baseTypes = typeMeta.extends.split(/\s*[|&]\s*/);

      for (const baseType of baseTypes) {
        const baseProps = this._flattenProperties(baseType, typeMap, new Set(visited));

        for (const baseProp of baseProps) {
          const existing = flatPropsMap[baseProp.name];
          const isIntersection = typeMeta.extends.includes('&');

          if (existing) {
            // Merge with existing property
            existing.sources.push(
              ...baseProp.sources.map((s) => ({
                ...s,
                via: baseType, // Mark that this came via inheritance
              })),
            );

            // Update resolution rules:
            // For intersection, optional only if ALL sources are optional
            // For union, optional if ANY source is optional
            existing.optional = isIntersection ? existing.optional && baseProp.optional : existing.optional || baseProp.optional;

            // Type resolution (simplified - you might want more sophisticated logic)
            if (isIntersection) {
              existing.datatype =
                existing.datatype === baseProp.datatype ? existing.datatype : `${existing.datatype} & ${baseProp.datatype}`;
            } else {
              existing.datatype =
                existing.datatype === baseProp.datatype ? existing.datatype : `${existing.datatype} | ${baseProp.datatype}`;
            }
          } else {
            // Add new inherited property
            flatPropsMap[baseProp.name] = {
              ...baseProp,
              sources: baseProp.sources.map((s) => ({
                ...s,
                via: baseType,
              })),
              optional: typeMeta.extends.includes('|')
                ? true // Union makes all inherited props optional
                : baseProp.optional,
            };
          }
        }
      }
    }

    return Object.values(flatPropsMap);
  }

  private _createWithDirectProps(typeMeta: TypeMeta): Record<string, FlatPropertyMeta> {
    const flatPropsMap: Record<string, FlatPropertyMeta> = {};
    for (const prop of typeMeta.properties) {
      flatPropsMap[prop.name] = {
        name: prop.name,
        sources: [
          {
            type: typeMeta.name,
            optional: prop.optional,
            comment: prop.comment,
          },
        ],
        datatype: prop.datatype,
        optional: prop.optional,
        isFunction: prop.isFunction,
        comment: prop.comment,
        properties: prop.properties,
      };
    }
    return flatPropsMap;
  }
}
