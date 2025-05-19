import { Project, SyntaxKind } from 'ts-morph';

import { Node, PropertySignature, MethodSignature, TypeLiteralNode } from 'ts-morph';

export interface PropertyMeta {
  name: string;
  optional: boolean;
  type: string;
  isFunction: boolean;
  properties?: PropertyMeta[]; // nested properties for object types
  comment: string;
}

export interface InheritedRecord {
  inheritedFrom: string; // type
  properties: PropertyMeta[];
}

export interface TypeAliasMeta {
  name: string;
  extends?: string; // base type(s) if the alias intersects with another
  properties: PropertyMeta[];
  traversed: boolean;
  inherited: Record<string, InheritedRecord>;
}

export function getNonGenericName(type: string) {
  return type.replace(/<.*?>/, '');
}

export function parseTypes(filePath: string): Record<string, TypeAliasMeta> {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);

  // Retrieve all exported type aliases in the file:contentReference[oaicite:5]{index=5}
  const typeAliases = sourceFile.getTypeAliases().filter((t) => t.isExported());

  // const result: TypeAliasMeta[] = [];
  const typeMap: Record<string, TypeAliasMeta> = {};

  for (const typeAlias of typeAliases) {
    // 1. Type name with generic parameters
    const name = typeAlias.getName();
    const typeParams = typeAlias.getTypeParameters().map((tp) => tp.getText());
    const fullName = typeParams.length ? `${name}<${typeParams.join(', ')}>` : name;

    // 2. Determine base (extended/intersected) types and the object literal part
    const typeNode = typeAlias.getTypeNode();
    let baseTypesText: string | undefined;
    let objectTypeNode: TypeLiteralNode | undefined;
    if (typeNode) {
      if (typeNode.getKind() === SyntaxKind.IntersectionType) {
        // If the type alias is an intersection (e.g., Base & { ... })
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
      } else if (Node.isTypeLiteral(typeNode)) {
        // The entire alias is just an object type literal (no base intersect)
        objectTypeNode = typeNode;
      } else if (Node.isTypeReference(typeNode) || Node.isExpressionWithTypeArguments(typeNode)) {
        // Alias is simply referencing another type (no inline object)
        baseTypesText = typeNode.getText();
        // const name = typeAlias.getName();
        // const typeParams = typeAlias.getTypeParameters();
        // const fullName = typeParams.length ? `${name}<${typeParams.map((p) => p.getText()).join(', ')}>` : name;
        // console.log('###', name, typeParams, fullName);
        // baseTypesText = fullName;
        // No inline properties to extract in this case
      }
    }

    // 3. Extract properties (including nested) from the object type literal, if present
    const properties: PropertyMeta[] = [];
    if (objectTypeNode) {
      const parseProperties = (node: TypeLiteralNode, targetList: PropertyMeta[]) => {
        node.forEachChild((child) => {
          if (Node.isPropertySignature(child) || Node.isMethodSignature(child)) {
            const propName = child.getName();
            const optional = (child as PropertySignature | MethodSignature).hasQuestionToken?.() ?? false; // optional if '?' is present:contentReference[oaicite:6]{index=6}
            let propTypeText: string;
            let isFunc = false;
            let nestedProps: PropertyMeta[] | undefined;

            if (Node.isPropertySignature(child)) {
              // Property with an explicitly defined type
              const propTypeNode = child.getTypeNode();
              if (propTypeNode) {
                propTypeText = propTypeNode.getText(); // full type text as written:contentReference[oaicite:7]{index=7}
                if (propTypeNode.getKind() === SyntaxKind.FunctionType) {
                  isFunc = true; // e.g., property is of type `() => something`
                } else if (Node.isTypeLiteral(propTypeNode)) {
                  // Nested inline object type – recurse into its properties
                  nestedProps = [];
                  parseProperties(propTypeNode, nestedProps);
                }
              } else {
                // If no explicit type node (should not happen in type literals), fallback to inferred type text
                propTypeText = child.getType().getText();
              }
            } else {
              // Method signature (treated as a function property)
              isFunc = true;
              // Construct function type text from parameters and return type
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
              type: propTypeText,
              isFunction: isFunc,
              comment: comment,
            };
            if (nestedProps) {
              propMeta.properties = nestedProps;
            }
            targetList.push(propMeta);
          }
          // (Ignore other type elements like index signatures for this use-case)
        });
      };
      parseProperties(objectTypeNode, properties);
    }

    typeMap[fullName] = {
      name: fullName,
      extends: baseTypesText, //.replace('<', '\\<').replace('>', '\\>'),
      properties: properties,
      traversed: false,
      inherited: {},
    };
  }
  return typeMap;
}
