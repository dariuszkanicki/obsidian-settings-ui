import { FlatPropertyMeta, InheritedRecord, PropertyMeta, PropertySource, TypeMeta } from '../parse-types.js';
import { DocWriter } from './doc-writer.js';

interface MergeProperty {
  name: string[];
  optional: boolean[];
}
export abstract class AbstractDocWriter implements DocWriter {
  getMarkdownContent(def: TypeMeta, typeMap: Record<string, TypeMeta>, knownTypes: Set<string>): string {
    const lines: string[] = [`# \`${def.name}\``];

    if (def.extends) {
      lines.push(`**Extends:** ${def.extends}`);
    }
    if (def.flatProperties) {
      lines.push('## Properties ');
      // this.logger.setEnabled(def.name === 'Button');
      // this.logger.log(JSON.stringify(def, null, 2));
      this.printTableHeader(lines);
      // this._printProperties(def.properties, lines, knownTypes);
      this._printProperties(def.flatProperties, lines, knownTypes);
      this.printTableFooter(lines);
    }
    // let extends: any;

    // if (def.inherited) {
    //   for (const name in def.inherited) {
    //     const inherited = def.inherited[name];
    //     const inheritedType = typeMap[name];

    //     if (inherited.name) lines.push(`## Properties from ${name}`);
    //     this.printTableHeader(lines);
    //     this._printProperties(inherited.properties, lines, knownTypes);
    //     if (inheritedType.extends) {
    //       for (const subName in inheritedType.inherited) {
    //         this.printExtendingType(lines, subName);
    //         const subType = inheritedType.inherited[subName];
    //         this._printProperties(subType.properties, lines, knownTypes);
    //       }
    //     }
    //     this.printTableFooter(lines);
    //   }
    // }

    return lines.join('\n');
  }

  // private _printAllProperties(properties: PropertyMeta[], map: Record<string, InheritedRecord>, lines: string[], knownTypes: Set<string>) {
  //   this._printProperties(properties, lines, knownTypes);
  //   for (const name in map) {
  //     const inherited = map[name];
  //     this.printExtendingType(lines, name);
  //     this._printProperties(inherited.properties, lines, knownTypes);
  //   }
  // }
  private _printProperties(properties: FlatPropertyMeta[], lines: string[], knownTypes: Set<string>) {
    for (const name in properties) {
      this.printType(lines, properties[name], knownTypes);
    }
  }

  protected abstract printTableHeader(lines: string[]): void;
  protected abstract printType(lines: string[], property: FlatPropertyMeta, knownTypes: Set<string>): void;
  protected abstract printExtendingType(lines: string[], name: string): void;
  protected abstract printTableFooter(lines: string[]): void;
}
