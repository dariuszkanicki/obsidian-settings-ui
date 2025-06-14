import { AbstractDocWriter } from './abstract-doc-writer.js';
import type { FlatPropertyMeta, PropertyMeta } from '../type-resolver.js';

export class HtmlWriter extends AbstractDocWriter {
  protected printSubsectionTitle(lines: string[], title: string): void {
    let result = '<tr>';
    result += `<td colspan='3'><b><em>${title}</em></b></td>`;
    result += '</tr>';
    lines.push(result);
  }
  protected printTableHeader(lines: string[]): void {
    lines.push('<table><tr><th>Name</th><th>Type</th><th>Description</th></tr>');
  }

  protected printTableFooter(lines: string[]): void {
    lines.push('</table>');
  }

  private _flatType(flatProp: FlatPropertyMeta): string {
    if (flatProp.sources.length <= 1) {
      // Single source - use simple format
      return flatProp.optional ? `${flatProp.name}?` : flatProp.name;
    }

    // Check if optionality changes across sources
    const hasOptional = flatProp.sources.some((s) => s.optional);
    const hasRequired = flatProp.sources.some((s) => !s.optional);

    if (!hasOptional) {
      // Always required
      return flatProp.name;
    }
    if (!hasRequired) {
      // Always optional
      return `${flatProp.name}?`;
    }

    // Mixed optionality - determine order based on first occurrence
    const firstOptionalIndex = flatProp.sources.findIndex((s) => s.optional);
    const firstRequiredIndex = flatProp.sources.findIndex((s) => !s.optional);

    if (firstOptionalIndex < firstRequiredIndex) {
      // Optional appears before required
      return `${flatProp.name}? | ${flatProp.name}`;
    } else {
      // Required appears before optional
      return `${flatProp.name} | ${flatProp.name}?`;
    }
  }
  private _type(flatProp: PropertyMeta): string {
    return `${flatProp.name}${flatProp.optional ? '?' : ''}`;
  }

  protected printType(lines: string[], property: PropertyMeta, knownTypes: Set<string>): void {
    if (property.name === 'type') {
      this._row(lines, [property.name, property.datatype, '']);
    } else {
      this._row(lines, [this._type(property), this._typeColumn(property, knownTypes), property.comment]);
    }
  }
  protected printFlatType(lines: string[], property: FlatPropertyMeta, knownTypes: Set<string>): void {
    if (property.name === 'type') {
      this._row(lines, [property.name, property.datatype, '']);
    } else {
      this._row(lines, [this._flatType(property), this._typeColumn(property, knownTypes), property.comment]);
    }
  }

  _row(lines: string[], content: string[]) {
    let result = '<tr>';
    content.forEach((column, index) => {
      if (index === 2) {
        result += `<td>${column}</td>`;
      } else {
        result += `<td><code>${column}</code></td>`;
      }
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
      const match = property.datatype.match(pattern);
      if (match?.groups) {
        const { before, after } = match.groups;
        const name = knownType.replace(/<.*?>/, '');
        result = '';
        if (before) {
          result += before;
        }
        result += `<a href='${name}.md'>${knownType}</a>`;
        if (after) {
          result += after;
        }
      }
    });
    if (!result) {
      result = property.datatype.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    }
    return result;
  }
}
