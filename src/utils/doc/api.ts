import path from 'node:path';
import fs from 'node:fs';
import { Logger } from './logger.js';
import { getNonGenericName, parseTypes, TypeAliasMeta } from './parse-types.js';
import { TypeDefinition } from './lib.js';
import { AbstractType } from './abstract-type.js';

export class Api extends AbstractType {
  typeMap: Record<string, TypeAliasMeta>;
  knownTypes;

  constructor(
    private inputPath: string,
    private outputPath: string,
  ) {
    super();
    const filePath = path.resolve(inputPath);
    this.typeMap = parseTypes(filePath);
    this.knownTypes = new Set(Object.keys(this.typeMap));
  }

  debugTypeMap() {
    const sortedTypeMap = Object.fromEntries(Object.entries(this.typeMap).sort(([a], [b]) => a.localeCompare(b)));
    // this.logger.log(sortedTypeMap);
    // fs.writeFileSync(path.join(OUTPUT_DIR, '_output.txt'), JSON.stringify(sortedTypeMap, null, 2), 'utf-8');
    // for (const [typeName, def] of Object.entries(typeMap)) {
    //   const debugText = JSON.stringify(def, null, 2);
    //   const txtPath = path.join(OUTPUT_DIR, `${typeName}.txt`);
    //   fs.writeFileSync(txtPath, debugText, 'utf-8');
    // }
    // console.log('📂 Individual .txt debug files written for all types.');
  }

  generateDoc() {
    fs.mkdirSync(this.outputPath, { recursive: true });

    for (const name in this.typeMap) {
      const def = this.typeMap[name];
      const filename = getNonGenericName(name);
      let mdPath;
      let markdown;
      mdPath = path.join(this.outputPath, `${filename}.md`);
      markdown = this._generateAPI(def);
      fs.writeFileSync(mdPath, markdown, 'utf-8');
      this.logger.log(`✅ ${filename}.md written`);
    }
  }

  private _generateAPI(def: TypeAliasMeta): string {
    const lines: string[] = [
      `# \`${def.name}\``,
      '',
      // '```ts',
      // def.kind === 'type'
      //   ? `export type ${def.name} = ${def.body};`
      //   : `export interface ${def.name}${def.extends ? ' extends ' + def.extends : ''} {\n${def.body}\n}`,
      // '```',
      // '',
    ];

    if (def.extends) {
      // const parts = def.extends
      //   .split(/[\|\&]/)
      //   .map((s) =>
      //     s
      //       .replace(/<.*?>/, '')
      //       .replace(/^[()]+/, '')
      //       .replace(/[()]+$/, '')
      //       .replace(/^\(+/, '') // remove leading (
      //       .replace(/\)+$/, '') // remove trailing )
      //       .trim(),
      //   )
      //   .filter((v, i, a) => v && a.indexOf(v) === i);

      // const links = parts.map((part) => {
      //   const nameOnly = part
      //     .replace(/<.*?>/, '') // Remove generics
      //     .replace(/[()]/g, '') // Remove parens
      //     .trim();
      //   const cleanLabel = part.replace(/[()]/g, '').trim(); // Fix link text
      //   return `[\`${cleanLabel}\`](${nameOnly}.md)`;
      // });
      // lines.push(`**Extends:** ${links.join(' | ')}`);
      lines.push(`**Extends:** ${def.extends}`);
    }

    this.logger.log('---x');
    if (def.properties) {
      lines.push('## Properties');
      lines.push('| Name | Type | Description |');
      lines.push('| ---- | ---- | ----------- |');
      def.properties.forEach((property) => {
        if (property.name === 'type') {
          lines.push(`| \`${property.name}\` | \`${property.type}\` | |`);
        } else {
          if (property.optional) {
            lines.push(`| \`${property.name}?\` | ${this.typeColumn(property, this.knownTypes)} | |`);
          } else {
            lines.push(`| \`${property.name}\` | ${this.typeColumn(property, this.knownTypes)} | |`);
          }
        }
      });
    }
    return lines.join('\n');
  }
}

// export function nonGenericName(input: string) {
//   const regex = /^(?<name>\w+)(?:<[^>]+>)?$/;
//   const match = input.match(regex);

//   if (match) {
//     const name = match.groups?.name;
//     // console.log('nonGenericName:', name);
//     return name;
//   } else {
//     throw Error(`nonGenericName: can't parse <${input}>`);
//   }
// }
