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

  const interfacePattern = /export\s+interface\s+(\w+)[^{]*{([\s\S]*?)}\s*/gm;
  let match: RegExpExecArray | null;
  while ((match = interfacePattern.exec(source)) !== null) {
    const [_, name, body] = match;
    typeMap[name] = {
      kind: 'interface',
      name,
      properties: parseProperties(body),
      body: body.trim(),
    };
  }

  // Match type blocks (from '=' to ';')
  // const typePattern = /export\s+type\s+(\w+)[^=]*=\s*([\s\S]*?);/gm;
  // const typePattern = /export\s+type\s+(\w+)[^=]*=\s*([\s\S]*?});?/gm;
  const typePattern = /export\s+type\s+(\w+)[^=]*=\s*([^;]+);/gm;

  while ((match = typePattern.exec(source)) !== null) {
    const [_, name, body] = match;
    const trimmed = body.trim();
    let base = '';
    let objectBody = '';
    let props: Record<string, string> = {};

    if (trimmed.includes('&') && trimmed.includes('{')) {
      const baseMatch = trimmed.match(/^([^&]+)&\s*{([\s\S]*)}\s*;?$/);
      if (baseMatch) {
        base = baseMatch[1].trim();
        objectBody = baseMatch[2].trim().replace(/}$/, '');
        props = parseProperties(objectBody);
      }
    }

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

function generateMarkdown(def: TypeDefinition): string {
  const lines: string[] = [
    `# \`${def.name}\` (${def.kind})`,
    '',
    '```ts',
    def.kind === 'type' ? `export type ${def.name} = ${def.body};` : `export interface ${def.name} {\n${def.body}\n}`,
    '```',
    '',
  ];

  if (def.extends) {
    const parts = def.extends
      .split(/[\|\&]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const links = parts.map((part) => {
      const nameOnly = part.replace(/<.*?>/, '').trim();
      return `[\`${part}\`](./${nameOnly}.md)`;
    });

    lines.push(`**Extends:** ${links.join(' | ')}`);
  }

  if (def.properties) {
    lines.push('## Properties');
    for (const [key, value] of Object.entries(def.properties)) {
      lines.push(`- \`${key}\`: \`${value}\``);
    }
  }

  return lines.join('\n');
}
// Entry
const [, , typeName] = process.argv;
const filePath = path.resolve(INPUT_FILE);
const source = fs.readFileSync(filePath, 'utf-8');

if (!typeName) {
  console.error('Usage: node extract-types.js <type-name>');
  process.exit(1);
}

const result = extractTypes(source);

if (!result[typeName]) {
  console.error(`❌ Type or interface named "\${typeName}" not found in \${inputFile}`);
  process.exit(1);
} else {
  const markdown = generateMarkdown(result[typeName]);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const mdPath = path.join(OUTPUT_DIR, `${typeName}.md`);
  fs.writeFileSync(mdPath, markdown, 'utf-8');
  console.log(`✅ Markdown written to \${mdPath}`);
  console.log(JSON.stringify(result[typeName], null, 2));
}
