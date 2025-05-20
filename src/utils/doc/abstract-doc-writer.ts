import { InheritedRecord, PropertyMeta, TypeAliasMeta } from './parse-types.js';

export interface DocWriter {
  getMarkdownContent(def: TypeAliasMeta, knownTypes: Set<string>): string;
}

export abstract class AbstractDocWriter implements DocWriter {
  getMarkdownContent(def: TypeAliasMeta, knownTypes: Set<string>): string {
    const lines: string[] = [`# \`${def.name}\``];

    if (def.extends) {
      lines.push(`**Extends:** ${def.extends}`);
    }
    if (def.properties) {
      lines.push('## Properties ');
      // this.logger.setEnabled(def.name === 'Button');
      // this.logger.log(JSON.stringify(def, null, 2));
      this.printTableHeader(lines);
      this._printAllProperties(def.properties, def.inherited, lines, knownTypes);
      this.printTableFooter(lines);
    }

    return lines.join('\n');
  }

  private _printAllProperties(properties: PropertyMeta[], map: Record<string, InheritedRecord>, lines: string[], knownTypes: Set<string>) {
    this._printProperties(properties, lines, knownTypes);
    for (const name in map) {
      const inherited = map[name];
      this.printExtendingType(lines, name);
      this._printProperties(inherited.properties, lines, knownTypes);
    }
  }
  private _printProperties(properties: PropertyMeta[], lines: string[], knownTypes: Set<string>) {
    properties.forEach((property) => {
      this.printType(lines, property, knownTypes);
    });
  }

  protected abstract printTableHeader(lines: string[]): void;
  protected abstract printType(lines: string[], property: PropertyMeta, knownTypes: Set<string>): void;
  protected abstract printExtendingType(lines: string[], name: string): void;
  protected abstract printTableFooter(lines: string[]): void;
}
