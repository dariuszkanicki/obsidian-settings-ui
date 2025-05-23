import { FlatPropertyMeta, PropertyMeta, TypeMeta } from '../parse-types.js';
import { DocWriter } from './doc-writer.js';

export abstract class AbstractDocWriter implements DocWriter {
  getMarkdownContent(typeMeta: TypeMeta, typeMap: Record<string, TypeMeta>, knownTypes: Set<string>): string {
    const lines: string[] = [`# \`${typeMeta.name}\``];

    if (typeMeta.extends) {
      lines.push(`**Extends:** ${typeMeta.extends}`);
    }
    if (typeMeta.flatProperties) {
      lines.push('## Properties ');
      // this.logger.setEnabled(def.name === 'Button');
      // this.logger.log(JSON.stringify(def, null, 2));
      this.printTableHeader(lines);

      this._printProperties(typeMeta.properties, lines, knownTypes);

      if (typeMeta.extends === 'BaseSetting') {
        const props = typeMeta.flatProperties.filter((prop) => prop.name !== 'id' && prop.name !== 'label');
        if (props.length < typeMeta.flatProperties.length) {
          props.unshift({
            name: 'id, label? | label',
            datatype: 'string',
            optional: false,
            isFunction: false,
            comment: 'aha',
            sources: [],
          });
        }
        this._printFlatProperties(props, lines, knownTypes);
      } else {
        this._printFlatProperties(typeMeta.flatProperties, lines, knownTypes);
      }
      this.printTableFooter(lines);
    }
    return lines.join('\n');
  }

  private _printProperties(properties: PropertyMeta[], lines: string[], knownTypes: Set<string>) {
    for (const name in properties) {
      this.printType(lines, properties[name], knownTypes);
    }
  }
  private _printFlatProperties(properties: FlatPropertyMeta[], lines: string[], knownTypes: Set<string>) {
    for (const name in properties) {
      this.printFlatType(lines, properties[name], knownTypes);
    }
  }

  protected abstract printTableHeader(lines: string[]): void;
  protected abstract printFlatType(lines: string[], property: FlatPropertyMeta, knownTypes: Set<string>): void;
  protected abstract printType(lines: string[], property: PropertyMeta, knownTypes: Set<string>): void;
  protected abstract printExtendingType(lines: string[], name: string): void;
  protected abstract printTableFooter(lines: string[]): void;
}
