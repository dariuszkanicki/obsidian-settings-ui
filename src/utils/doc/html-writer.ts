import { AbstractDocWriter, DocWriter } from './abstract-doc-writer.js';
import { PropertyMeta } from './parse-types.js';

export class HtmlWriter extends AbstractDocWriter {
  protected printTableHeader(lines: string[]): void {
    lines.push('<table><tr><th>Name</th><th>Type</th><th>Description</th></tr>');
  }
  protected printTableFooter(lines: string[]): void {
    lines.push('</table>');
  }

  protected printType(lines: string[], property: PropertyMeta, knownTypes: Set<string>): void {
    const optionalMark = property.optional ? '?' : '';
    if (property.name === 'type') {
      this._row(lines, [property.name + optionalMark, property.type, '']);
    } else {
      this._row(lines, [property.name + optionalMark, this._typeColumn(property, knownTypes), '']);
    }
  }
  //   <tr>
  //     <td colspan="3" style="background-color: #ffdfd0">Button specific properties</td>
  //   </tr>
  //   <tr><td><code>${property.name}${optionalMark}</code></td><td><code>${property.type}</code></td></tr>
  //     <td><code>'Button'<code></td>
  //     <td></td>
  //   </tr>

  _row(lines: string[], content: string[]) {
    let result = '<tr>';
    content.forEach((column) => {
      result += `<td><code>${column}</code></td>`;
    });
    result += '</tr>';
    lines.push(result);
  }

  protected printExtendingType(lines: string[], name: string): void {
    let result = '<tr>';
    result += `<td><code>${name}</code></td>`;
    result += `<td></td>`;
    result += `<td></td>`;
    result += '</tr>';
    lines.push(result);
  }

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
