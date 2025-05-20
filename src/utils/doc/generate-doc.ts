import path from 'node:path';
import fs from 'node:fs';
import { exit } from 'node:process';
import { TypeDefinition } from './lib.js';

import { Logger } from './logger.js';
import { ApiTypes } from './api-types.js';
import { GenTypes as BasisTypes } from './basis-types.js';
import { TypeAliasMeta } from './parse-types.js';

const INPUT_API = 'src/renderer/types-api.ts';
const OUTPUT_DIR = 'docs/generated';

function linkType(value: string, known: Set<string>): string {
  return value.replace(/\b[\w]+(?:<[^>]+>)?/g, (match) => {
    const name = match.replace(/<.*?>/, ''); // Strip generics for lookup
    return known.has(name) ? `[\`${match}\`](${name}.md)` : `\`${match}\``;
  });
}

function generateIndex(all: Record<string, TypeDefinition>): string {
  const lines: string[] = ['# 📘 Type Documentation Index', ''];
  const sorted = Object.values(all).sort((a, b) => a.name.localeCompare(b.name));
  for (const def of sorted) {
    lines.push(`- [\`${def.name}\`](${def.name}.md) – _${def.name}_`);
  }
  return lines.join('\n');
}

const basisTypes = new BasisTypes('src/renderer/types.ts', 'docs/private');
basisTypes.generateDoc();
const baseTypeMap: Record<string, TypeAliasMeta> = basisTypes.getTypeMap();

const api = new ApiTypes('src/renderer/types-api.ts', 'docs/api');
api.populateInheritedFromBasis(baseTypeMap);
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
