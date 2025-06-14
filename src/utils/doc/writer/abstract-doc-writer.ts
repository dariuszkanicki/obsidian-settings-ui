import type { FlatPropertyMeta, PropertyMeta, TypeMeta } from '../type-resolver.js';
import type { DocWriter } from './doc-writer.js';

export abstract class AbstractDocWriter implements DocWriter {
  getMarkdownContent(typeMeta: TypeMeta, typeMap: Record<string, TypeMeta>, knownTypes: Set<string>): string {
    const lines: string[] = [`# \`${typeMeta.name.replace('<T>', '')}\``];

    if (typeMeta.comment) {
      lines.push(
        typeMeta.comment
          .replaceAll('<hr/>', '<hr style="border: none; height: 1px; background-color: #ddd;" />')
          .replaceAll('---', '<hr style="border: none; height: 1px; background-color: #ddd;" />'),
      );
    }
    if (typeMeta.flatProperties) {
      lines.push('## Parameters ');
      // this.logger.setEnabled(def.name === 'Button');
      // this.logger.log(JSON.stringify(def, null, 2));
      this.printTableHeader(lines);

      this._printProperties(typeMeta.properties, lines, knownTypes);
      this.printSubsectionTitle(lines, 'Common for all elements');
      if (typeMeta.extends === 'PathSetting<T>') {
        const props = typeMeta.flatProperties.filter((prop) => prop.name !== 'path' && prop.name !== 'handler' && prop.name !== 'id');
        if (props.length < typeMeta.flatProperties.length) {
          this.printSubsectionTitle(lines, 'Variante (a):');
          this.printFlatType(
            lines,
            {
              name: 'path',
              datatype: 'string',
              optional: false,
              isFunction: false,
              comment: 'The name (path) of the element in the settings structure',
              sources: [],
            },
            knownTypes,
          );
          this.printSubsectionTitle(lines, 'Variante (b):');
          this.printFlatType(
            lines,
            {
              name: 'handler',
              datatype: 'SettingHandler',
              optional: false,
              isFunction: false,
              comment: 'Used if the values are not stored in the settings',
              sources: [],
            },
            knownTypes,
          );
          this.printFlatType(
            lines,
            {
              name: 'id? | id',
              datatype: 'string',
              optional: false,
              isFunction: false,
              comment: 'Mandatory if localization is used',
              sources: [],
            },
            knownTypes,
          );
        }
        this.printSubsectionTitle(lines, 'Common in both variants');
        this._printFlatProperties(props, lines, knownTypes);
      } else {
        this._printFlatProperties(typeMeta.flatProperties, lines, knownTypes);
      }
      this.printTableFooter(lines);
    }

    return lines.join('\n');
  }

  private _printProperties(properties: PropertyMeta[], lines: string[], knownTypes: Set<string>) {
    for (const property of properties) {
      this.printType(lines, property, knownTypes);
    }
  }
  private _printFlatProperties(properties: FlatPropertyMeta[], lines: string[], knownTypes: Set<string>) {
    for (const property of properties) {
      this.printFlatType(lines, property, knownTypes);
    }
  }

  protected abstract printTableHeader(lines: string[]): void;
  protected abstract printFlatType(lines: string[], property: FlatPropertyMeta, knownTypes: Set<string>): void;
  protected abstract printType(lines: string[], property: PropertyMeta, knownTypes: Set<string>): void;
  protected abstract printSubsectionTitle(lines: string[], title: string): void;
  protected abstract printExtendingType(lines: string[], name: string): void;
  protected abstract printTableFooter(lines: string[]): void;
}
