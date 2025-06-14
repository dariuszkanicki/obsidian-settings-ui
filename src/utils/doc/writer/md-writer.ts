import { AbstractDocWriter } from './abstract-doc-writer.js';
import type { FlatPropertyMeta } from '../type-resolver.js';

export class MdWriter extends AbstractDocWriter {
  protected printSubsectionTitle(_lines: string[], _title: string): void {
    throw new Error('Method not implemented.');
  }
  protected printFlatType(_lines: string[], _property: FlatPropertyMeta, _knownTypes: Set<string>): void {
    throw new Error('Method not implemented.');
  }
  protected printTableHeader(lines: string[]) {
    lines.push('| Namec | Type | Description |');
    lines.push('| ---- | ---- | ----------- |');
  }

  private _type(property: FlatPropertyMeta) {
    let result = property.name;
    property.sources.forEach((source) => {
      result += ':' + (source.optional ? '?' : '') + source.type;
    });
    return result;
  }

  protected printType(lines: string[], property: FlatPropertyMeta, knownTypes: Set<string>): void {
    const optionalMark = property.sources[0].optional ? '?' : '';
    if (property.name === 'type') {
      lines.push(`| \`${property.name}${optionalMark}\` | \`${property.datatype}\` | |`);
    } else {
      lines.push(`| \`${property.name}${optionalMark}\` | ${this._typeColumn(property, knownTypes)} | |`);
    }
  }

  protected printExtendingType(lines: string[], name: string): void {
    lines.push(`| \`${name}\` | --- | |`);
  }

  protected printTableFooter(_lines: string[]): void {}

  private _typeColumn(property: FlatPropertyMeta, known: Set<string>): string {
    let result;
    known.forEach((knownType) => {
      const pattern = new RegExp(`^(?<before>[\\s\\S]*?)${knownType}(?<after>[\\s\\S]*)$`);
      const match = property.datatype.match(pattern);
      if (match?.groups) {
        const { before, after } = match.groups;
        const name = knownType.replace(/<.*?>/, '');
        result = '';
        if (before) {
          result += '`' + before + '`';
        }
        result += '[`' + knownType + '`](' + name + ')';
        if (after) {
          result += '`' + after + '`';
        }
      }
    });
    if (!result) {
      result = '`' + property.datatype + '`';
    }
    // }
    return result.replaceAll('|', '\\|');
  }
}
