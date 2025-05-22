import path from 'node:path';
import fs from 'node:fs';

type TypeKind = 'interface' | 'type';

interface TypeDefinition {
  kind: TypeKind;
  name: string;
  extends?: string;
  properties?: Record<string, string>;
  body: string;
}

const INPUT_FILE = 'src/renderer/types.ts';
const OUTPUT_DIR = 'docs/generated-types';

function extractTypes(source: string): Record<string, TypeDefinition> {
  const typeMap: Record<string, TypeDefinition> = {};

  const interfacePattern = /export\s+interface\s+(\w+)\s*(?:extends\s+([^{]+))?\s*{([\s\S]*?)}\s*/gm;
  let match: RegExpExecArray | null;

  while ((match = interfacePattern.exec(source)) !== null) {
    const [_, name, ext, body] = match;
    typeMap[name] = {
      kind: 'interface',
      name,
      extends: ext?.trim(),
      properties: parseProperties(body),
      body: indentProperties(body.trim()),
    };
  }

  // const typePattern = /export\s+type\s+(\w+)[^=]*=\s*([^;]+);/gm;
  const typePattern = /export\s+type\s+(\w+)[^=]*=\s*((?:{[\s\S]*?})|(?:[^\n;]+));/gm;

  while ((match = typePattern.exec(source)) !== null) {
    const [_, name, body] = match;
    const trimmed = body.trim();

    const objectMatch = trimmed.match(/&?\s*{([\s\S]*)}/);
    const props = objectMatch ? parseProperties(objectMatch[1].trim()) : {};
    const base = trimmed.includes('{') ? trimmed.split('{')[0].trim() : trimmed;

    typeMap[name] = {
      kind: 'type',
      name,
      extends: base || undefined,
      properties: Object.keys(props).length ? props : undefined,
      body: trimmed,
    };
  }

  return typeMap;
}

function parseProperties(body: string): Record<string, string> {
  const props: Record<string, string> = {};
  for (const line of body.split('\n')) {
    const m = line.trim().match(/^([a-zA-Z0-9_]+)\??:\s*(.+?);?$/);
    if (m) {
      props[m[1]] = m[2];
    }
  }
  return props;
}

function indentProperties(body: string): string {
  return body
    .split('\n')
    .map((line) => '  ' + line.trim())
    .join('\n');
}

function _linkType(value: string, known: Set<string>): string {
  return value
    .split('|')
    .map((v) => {
      const cleaned = v
        .trim()
        .replace(/\[\]|<.*?>|\(.*?\)/g, '')
        .trim();
      return known.has(cleaned) ? `[\`${v.trim()}\`](${cleaned}.md)` : `\`${v.trim()}\``;
    })
    .join(' | ');
}
function linkType(value: string, known: Set<string>): string {
  return value.replace(/\b[\w]+(?:<[^>]+>)?/g, (match) => {
    const name = match.replace(/<.*?>/, ''); // Strip generics for lookup
    return known.has(name) ? `[\`${match}\`](${name}.md)` : `\`${match}\``;
  });
}

function generateMarkdown(def: TypeDefinition, knownTypes: Set<string>): string {
  const lines: string[] = [
    `# \`${def.name}\` (${def.kind})`,
    '',
    '```ts',
    def.kind === 'type'
      ? `export type ${def.name} = ${def.body};`
      : `export interface ${def.name}${def.extends ? ' extends ' + def.extends : ''} {\n${def.body}\n}`,
    '```',
    '',
  ];

  if (def.extends) {
    const parts = def.extends
      .split(/[\|\&]/)
      .map((s) =>
        s
          .replace(/<.*?>/, '')
          .replace(/^[()]+/, '')
          .replace(/[()]+$/, '')
          .replace(/^\(+/, '') // remove leading (
          .replace(/\)+$/, '') // remove trailing )
          .trim(),
      )
      .filter((v, i, a) => v && a.indexOf(v) === i);

    const links = parts.map((part) => {
      const nameOnly = part
        .replace(/<.*?>/, '') // Remove generics
        .replace(/[()]/g, '') // Remove parens
        .trim();
      const cleanLabel = part.replace(/[()]/g, '').trim(); // Fix link text
      return `[\`${cleanLabel}\`](${nameOnly}.md)`;
    });
    lines.push(`**Extends:** ${links.join(' | ')}`);
  }

  if (def.properties) {
    lines.push('## Properties');
    for (const [key, value] of Object.entries(def.properties)) {
      lines.push(`- \`${key}\`: ${linkType(value, knownTypes)}`);
    }
  }

  return lines.join('\n');
}

function generateIndex(all: Record<string, TypeDefinition>): string {
  const lines: string[] = ['# 📘 Type Documentation Index', ''];
  const sorted = Object.values(all).sort((a, b) => a.name.localeCompare(b.name));
  for (const def of sorted) {
    lines.push(`- [\`${def.name}\`](${def.name}.md) – _${def.kind}_`);
  }
  return lines.join('\n');
}

// ENTRY POINT
const filePath = path.resolve(INPUT_FILE);
const source = fs.readFileSync(filePath, 'utf-8');
const typeMap = extractTypes(source);
const knownTypes = new Set(Object.keys(typeMap));

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

for (const typeName in typeMap) {
  const def = typeMap[typeName];
  const markdown = generateMarkdown(def, knownTypes);
  const mdPath = path.join(OUTPUT_DIR, `${typeName}.md`);
  fs.writeFileSync(mdPath, markdown, 'utf-8');
  // console.log(`✅ ${typeName}.md written`);
}

// Write index.md
const indexMarkdown = generateIndex(typeMap);
const indexPath = path.join(OUTPUT_DIR, 'index.md');
fs.writeFileSync(indexPath, indexMarkdown, 'utf-8');
// console.log('📚 index.md written');
