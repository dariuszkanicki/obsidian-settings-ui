import path from 'node:path';
import { FlatPropertyMeta, PropertyMeta, TypeMeta } from './parse-types.js';
import { parseTypesFromFile } from './parse-typesX.js';
import { tlog } from './type-logger.js';

export class TypeResolver {
  private basisTypeMap: Record<string, TypeMeta> = {};
  private missingBaseTypes: Set<string> = new Set();

  constructor(basisTypesPath: string) {
    const filePath = path.resolve(basisTypesPath);
    this.basisTypeMap = parseTypesFromFile(filePath);

    // console.log(JSON.stringify(this.basisTypeMap['Basis'], null, 2));
    // tlog(this.basisTypeMap);
  }

  resolveApiTypes(apiTypesPath: string) {
    const sourceApiTypeMap = parseTypesFromFile(apiTypesPath);
    const resolvedApiTypeMap: Record<string, TypeMeta> = {};
    const visitedTypes = new Set<string>();

    for (const [sourceApiTypeName, sourceApiTypeMeta] of Object.entries(sourceApiTypeMap)) {
      if (sourceApiTypeName === 'SettingElement<T>') {
        // console.log('##### special handling');
      } else {
        if (sourceApiTypeMeta.extends) {
          const flatProperties = this._mergeFlattenProperties(sourceApiTypeName, sourceApiTypeMap, visitedTypes);
          resolvedApiTypeMap[sourceApiTypeName] = {
            ...sourceApiTypeMeta,
            // properties: this._resolveAgainstBasis(apiTypeMeta),
            flatProperties: flatProperties,
          };
        } else {
          resolvedApiTypeMap[sourceApiTypeName] = sourceApiTypeMeta;
        }
      }
    }
    console.log('==================================');
    console.log(JSON.stringify(resolvedApiTypeMap['Button'], null, 2));
    tlog(resolvedApiTypeMap);

    return resolvedApiTypeMap;
  }

  _mergeFlattenProperties(typeName: string, sourceApiTypeMap: Record<string, TypeMeta>, visited = new Set<string>()): FlatPropertyMeta[] {
    if (visited.has(typeName)) return [];
    visited.add(typeName);

    const type = sourceApiTypeMap[typeName];
    const flatPropsMap: Record<string, FlatPropertyMeta> = {};
    const baseTypeName = type.extends!;
    const baseType = this.basisTypeMap[baseTypeName];

    let flatProperty!: FlatPropertyMeta;
    const foundProperties = new Set<string>();
    for (const prop of type.properties) {
      // let propFound = false;
      for (const baseFlatProp of baseType.flatProperties) {
        if (baseFlatProp.name === prop.name) {
          // propFound = true;
          foundProperties.add(prop.name);
          break;
        }
      }
    }
    // console.log('###', JSON.stringify(baseType, null, 2));
    for (const baseFlatProp of baseType.flatProperties) {
      if (!foundProperties.has(baseFlatProp.name)) {
        flatProperty = structuredClone(baseFlatProp);
        for (const source of flatProperty.sources) {
          if (source.type === baseTypeName) {
            source.via = baseTypeName;
          }
        }
        flatPropsMap[baseFlatProp.name] = flatProperty;
      }
    }

    return Object.values(flatPropsMap);
  }
}
