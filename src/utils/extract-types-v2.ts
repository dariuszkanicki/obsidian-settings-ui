import path from 'node:path';
import fs from 'node:fs';

type TypeKind = 'interface' | 'type';

interface TypeDefinition {
  kind: TypeKind;
  name: string;
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
      body: body.trim(),
    };
  }

  // Match type blocks (from '=' to ';')
  const typePattern = /export\s+type\s+(\w+)[^=]*=\s*([\s\S]*?);/gm;
  while ((match = typePattern.exec(source)) !== null) {
    const [_, name, body] = match;
    typeMap[name] = {
      kind: 'type',
      name,
      body: body.trim(),
    };
  }

  return typeMap;
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
