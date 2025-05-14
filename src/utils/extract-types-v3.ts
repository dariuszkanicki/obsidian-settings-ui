
import path from 'node:path';
import fs from 'node:fs';

// CLI: node extract-types-v3.js <path-to-file> <type-name>
const [, , inputFile, typeName] = process.argv;

if (!inputFile || !typeName) {
  console.error('Usage: node extract-types-v3.js <path-to-ts-file> <type-name>');
  process.exit(1);
}

const filePath = path.resolve(inputFile);
const source = fs.readFileSync(filePath, 'utf-8');

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
    const properties = parseProperties(body);
    typeMap[name] = {
      kind: 'interface',
      name,
      properties,
      body: body.trim()
    };
  }

  // Match type blocks (e.g. type A = B & { ... };)
  const typePattern = /export\s+type\s+(\w+)[^=]*=\s*([\s\S]*?);/gm;
  while ((match = typePattern.exec(source)) !== null) {
    const [_, name, fullBody] = match;

    let base = '';
    let objectBody = '';
    let properties: Record<string, string> = {};

    const trimmedBody = fullBody.trim();

    if (trimmedBody.includes('&') && trimmedBody.includes('{')) {
      const parts = trimmedBody.split('&');
      base = parts[0].trim();
      const objectMatch = trimmedBody.match(/&\s*{([\s\S]*)}/);
      if (objectMatch) {
        objectBody = objectMatch[1].trim();
        properties = parseProperties(objectBody);
      }
    }

    typeMap[name] = {
      kind: 'type',
      name,
      extends: base || undefined,
      properties: Object.keys(properties).length > 0 ? properties : undefined,
      body: trimmedBody
    };
  }

  return typeMap;
}

function parseProperties(body: string): Record<string, string> {
  const propMap: Record<string, string> = {};
  const lines = body.split('\n');
  for (const line of lines) {
    const match = line.trim().match(/^([a-zA-Z0-9_]+)\??:\s*(.+?);?$/);
    if (match) {
      const [, key, type] = match;
      propMap[key] = type;
    }
  }
  return propMap;
}

const result = extractTypes(source);

if (result[typeName]) {
  console.log(JSON.stringify(result[typeName], null, 2));
} else {
  console.error(`❌ Type or interface named "\${typeName}" not found in \${inputFile}`);
  process.exit(1);
}
