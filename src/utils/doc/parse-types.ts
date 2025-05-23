import { Project, SyntaxKind } from 'ts-morph';

import { Node, PropertySignature, MethodSignature, TypeLiteralNode } from 'ts-morph';

export interface PropertySource {
  type: string; // The source type this property came from
  optional: boolean; // Whether it was optional in that source
  comment: string; // The comment from that source
  via?: string; // If inherited through another type (for multi-level inheritance)
}

export interface InheritedRecord {
  name: string; // type
  properties: PropertyMeta[];
}

export interface PropertyMeta {
  name: string;
  optional: boolean;
  datatype: string;
  isFunction: boolean;
  comment: string;
  properties?: PropertyMeta[]; // nested properties for object types
}

export interface FlatPropertyMeta {
  name: string;
  optional: boolean; // final value (// TODO check the concat function)
  datatype: string; // final ype (// TODO check for inconsistency)
  isFunction: boolean; // final type (// TODO check for inconsistency)
  comment: string; // final type (// TODO check the concat function)
  properties?: PropertyMeta[]; // nested properties for object types
  sources: PropertySource[];
}

export interface TypeMeta {
  name: string;
  extends?: string; // base type(s) if the alias intersects with another
  comment?: string;
  properties: PropertyMeta[];

  traversed: boolean;
  inheritanceType?: '&' | '|';
  inherited: Record<string, InheritedRecord>;

  flatProperties: FlatPropertyMeta[];
}

export function getNonGenericName(type: string) {
  return type.replace(/<.*?>/, '');
}

export function parseInitialTypes(filePath: string): Record<string, TypeMeta> {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);

  // Retrieve all exported types
  const typeAliases = sourceFile.getTypeAliases().filter((t) => t.isExported());
  const typeMap: Record<string, TypeMeta> = {};

  for (const typeAlias of typeAliases) {
    const name = typeAlias.getName();
    const comment = typeAlias
      .getJsDocs()
      .map((doc) => doc.getComment())
      .filter(Boolean)
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
            const optional = (child as PropertySignature | MethodSignature).hasQuestionToken?.() ?? false;
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
              .filter(Boolean)
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

export function mergeProperties(existing: PropertyMeta[], newProps: PropertyMeta[]): PropertyMeta[] {
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
            ? mergeProperties(existingProp.properties, newProp.properties)
            : existingProp.properties || newProp.properties,
        comment: newProp.comment || existingProp.comment, // Prefer new comment if exists
      };
    }
  }

  return merged;
}
