import { TypeResolver } from './type-resolver.js';
import { generateDoc } from './writer/doc-writer.js';
import { HtmlWriter } from './writer/html-writer.js';

// const INPUT_API = 'src/renderer/types-api.ts';
// const OUTPUT_DIR = 'docs/generated';

// function linkType(value: string, known: Set<string>): string {
//   return value.replace(/\b[\w]+(?:<[^>]+>)?/g, (match) => {
//     const name = match.replace(/<.*?>/, ''); // Strip generics for lookup
//     return known.has(name) ? `[\`${match}\`](${name}.md)` : `\`${match}\``;
//   });
// }

function _generateIndex(all: Record<string, TypeDefinition>): string {
  const lines: string[] = ['# 📘 Type Documentation Index', ''];
  const sorted = Object.values(all).sort((a, b) => a.name.localeCompare(b.name));
  for (const def of sorted) {
    lines.push(`- [\`${def.name}\`](${def.name}.md) – _${def.name}_`);
  }
  return lines.join('\n');
}

// const typeResolver = new TypeResolver('src/utils/doc/test/test-basis.ts');
// typeResolver.resolveApiTypes('src/utils/doc/test/test-api.ts');

const typeResolver = new TypeResolver('src/renderer/types.ts');
const typeMap = typeResolver.resolveApiTypes('src/renderer/types-api.ts');

// const basisTypes = new BasisTypes('src/renderer/types.ts', 'docs/private');
// basisTypes.generateDoc();
// const baseTypeMap: Record<string, TypeMeta> = basisTypes.getTypeMap();

// const api = new ApiTypes('src/renderer/types-api.ts', 'docs/api');
// api.populateInheritedFromBasis(baseTypeMap);
generateDoc(typeMap, new HtmlWriter(), 'docs/api');
export interface TypeDefinition {
  name: string;
  extends?: string;
  properties?: Record<string, string>;
}

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
