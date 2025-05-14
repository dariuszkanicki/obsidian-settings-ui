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

function extractTypes(source: string): Record<string, TypeDefinition> {
  const typeMap: Record<string, TypeDefinition> = {};

  // Match interface blocks
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
  const typePattern = /export\s+type\s+(\w+)[^=]*=\s*([\s\S]*?);/gm;
  while ((match = typePattern.exec(source)) !== null) {
    const [_, name, body] = match;
    const trimmed = body.trim();
    let base = '';
    let objectBody = '';
    let props: Record<string, string> = {};

    if (trimmed.includes('&') && trimmed.includes('{')) {
      const baseMatch = trimmed.match(/^([^&]+)&\s*{([\s\S]*)}$/);
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

const [, , typeName] = process.argv;
const inputFile = 'src/renderer/types.ts';

if (!typeName) {
  console.error('Usage: node extract-types.js <type-name>');
  process.exit(1);
}

const filePath = path.resolve(inputFile);
const source = fs.readFileSync(filePath, 'utf-8');

const result = extractTypes(source);

if (result[typeName]) {
  console.log(JSON.stringify(result[typeName], null, 2));
} else {
  console.error(`❌ Type or interface named "\${typeName}" not found in \${inputFile}`);
  process.exit(1);
}
