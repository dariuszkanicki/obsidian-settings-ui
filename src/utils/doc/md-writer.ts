import { AbstractDocWriter } from './abstract-doc-writer.js';
import { PropertyMeta } from './parse-types.js';

export class MdWriter extends AbstractDocWriter {
  protected printTableHeader(lines: string[]) {
    lines.push('| Namec | Type | Description |');
    lines.push('| ---- | ---- | ----------- |');
  }

  protected printType(lines: string[], property: PropertyMeta, knownTypes: Set<string>): void {
    const optionalMark = property.optional ? '?' : '';
    if (property.name === 'type') {
      lines.push(`| \`${property.name}${optionalMark}\` | \`${property.type}\` | |`);
    } else {
      lines.push(`| \`${property.name}${optionalMark}\` | ${this._typeColumn(property, knownTypes)} | |`);
    }
  }

  protected printExtendingType(lines: string[], name: string): void {
    lines.push(`| \`${name}\` | --- | |`);
  }

  protected printTableFooter(lines: string[]): void {}

  private _typeColumn(property: PropertyMeta, known: Set<string>): string {
    let result;
    known.forEach((knownType) => {
      const pattern = new RegExp(`^(?<before>[\\s\\S]*?)${knownType}(?<after>[\\s\\S]*)$`);
      const match = property.type.match(pattern);
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
      result = '`' + property.type + '`';
    }
    // }
    return result.replaceAll('|', '\\|');
  }
}
