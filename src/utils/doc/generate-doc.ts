import path from 'node:path';
import fs from 'node:fs';
import { exit } from 'node:process';
import { TypeDefinition } from './lib.js';

import { Logger } from './logger.js';
import { Api } from './api.js';
import { GenTypes } from './gen-types.js';

const INPUT_API = 'src/renderer/types-api.ts';
const OUTPUT_DIR = 'docs/generated';

function linkType(value: string, known: Set<string>): string {
  return value.replace(/\b[\w]+(?:<[^>]+>)?/g, (match) => {
    const name = match.replace(/<.*?>/, ''); // Strip generics for lookup
    return known.has(name) ? `[\`${match}\`](${name}.md)` : `\`${match}\``;
  });
}

// function generateMarkdown(def: TypeDefinition, knownTypes: Set<string>): string {
//   const lines: string[] = [
//     `# \`${def.name}\` (${def.kind})`,
//     '',
//     '```ts',
//     def.kind === 'type'
//       ? `export type ${def.name} = ${def.body};`
//       : `export interface ${def.name}${def.extends ? ' extends ' + def.extends : ''} {\n${def.body}\n}`,
//     '```',
//     '',
//   ];

//   if (def.extends) {
//     def.extends.forEach((extendType) => {
//       const parts = extendType
//         .split(/[\|\&]/)
//         .map((s) =>
//           s
//             .replace(/<.*?>/, '')
//             .replace(/^[()]+/, '')
//             .replace(/[()]+$/, '')
//             .replace(/^\(+/, '') // remove leading (
//             .replace(/\)+$/, '') // remove trailing )
//             .trim(),
//         )
//         .filter((v, i, a) => v && a.indexOf(v) === i);

//       const links = parts.map((part) => {
//         const nameOnly = part
//           .replace(/<.*?>/, '') // Remove generics
//           .replace(/[()]/g, '') // Remove parens
//           .trim();
//         const cleanLabel = part.replace(/[()]/g, '').trim(); // Fix link text
//         return `[\`${cleanLabel}\`](${nameOnly}.md)`;
//       });
//       lines.push(`**Extends:** ${links.join(' | ')}`);
//     });
//   }

//   if (def.properties) {
//     lines.push('## Properties');
//     for (const [key, value] of Object.entries(def.properties)) {
//       lines.push(`- \`${key}\`: ${linkType(value, knownTypes)}`);
//     }
//   }

//   return lines.join('\n');
// }

function generateIndex(all: Record<string, TypeDefinition>): string {
  const lines: string[] = ['# 📘 Type Documentation Index', ''];
  const sorted = Object.values(all).sort((a, b) => a.name.localeCompare(b.name));
  for (const def of sorted) {
    lines.push(`- [\`${def.name}\`](${def.name}.md) – _${def.name}_`);
  }
  return lines.join('\n');
}

const getTypes = new GenTypes('src/renderer/types.ts', 'docs/private');

getTypes.traverseInheritance(getTypes.typeMap);
getTypes.generateDoc();

const api = new Api('src/renderer/types-api.ts', 'docs/api');
api.generateDoc();

// if (def.api) {
// } else {
//   mdPath = path.join(GEN_DIR, `${filename}.md`);
//   markdown = generateMarkdown(def, knownTypes);
// }

// Write index.md
// const indexMarkdown = generateIndex(typeMap);
// const indexPath = path.join(GEN_DIR, 'index.md');
// fs.writeFileSync(indexPath, indexMarkdown, 'utf-8');
// console.log('📚 index.md written');
