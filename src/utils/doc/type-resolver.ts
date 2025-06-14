import { TypeParser } from './type-parser.js';

export class TypeResolver {
  private basisTypeMap: Record<string, TypeMeta> = {};

  constructor(basisTypesPath: string) {
    this.basisTypeMap = new TypeParser().parseTypesFromFile(basisTypesPath);
    // console.log(JSON.stringify(this.basisTypeMap['Basis'], null, 2));
    // tlog(this.basisTypeMap);
  }

  resolveApiTypes(apiTypesPath: string) {
    const sourceApiTypeMap = new TypeParser().parseTypesFromFile(apiTypesPath);
    const resolvedApiTypeMap: Record<string, TypeMeta> = {};
    const visitedTypes = new Set<string>();

    for (const [sourceApiTypeName, sourceApiTypeMeta] of Object.entries(sourceApiTypeMap)) {
      if (sourceApiTypeName !== 'SettingElement<T>') {
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
    // console.log(JSON.stringify(resolvedApiTypeMap['Button'], null, 2));
    // tlog(resolvedApiTypeMap);

    return resolvedApiTypeMap;
  }

  private _mergeFlattenProperties(
    typeName: string,
    sourceApiTypeMap: Record<string, TypeMeta>,
    visited = new Set<string>(),
  ): FlatPropertyMeta[] {
    if (visited.has(typeName)) return [];
    visited.add(typeName);

    const type = sourceApiTypeMap[typeName];
    const flatPropsMap: Record<string, FlatPropertyMeta> = {};
    const baseTypeName = type.extends!;
    const baseType = this.basisTypeMap[baseTypeName];

    let flatProperty!: FlatPropertyMeta;
    const foundProperties = new Set<string>();
    for (const prop of type.properties) {
      for (const baseFlatProp of baseType.flatProperties) {
        if (baseFlatProp.name === prop.name) {
          foundProperties.add(prop.name);
          break;
        }
      }
    }

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
