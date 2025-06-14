import path from 'node:path';
import fs from 'node:fs';
import type { TypeMeta } from '../type-resolver.js';

export interface DocWriter {
  getMarkdownContent(def: TypeMeta, typeMap: Record<string, TypeMeta>, knownTypes: Set<string>): string;
}

export function generateDoc(typeMap: Record<string, TypeMeta>, docWriter: DocWriter, outputPath: string) {
  fs.mkdirSync(outputPath, { recursive: true });
  const knownTypes = new Set(Object.keys(typeMap));

  for (const name in typeMap) {
    const typeMeta = typeMap[name];
    const filename = getNonGenericName(name);
    const mdPath = path.join(outputPath, `${filename}.md`);
    const markdown = docWriter.getMarkdownContent(typeMeta, typeMap, knownTypes);
    fs.writeFileSync(mdPath, markdown, 'utf-8');
    // this.logger.log(`✅ ${filename}.md written`);
  }
}
export function getNonGenericName(type: string) {
  return type.replace(/<.*?>/, '');
}
