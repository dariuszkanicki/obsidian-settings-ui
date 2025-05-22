import path from 'node:path';
import fs from 'node:fs';
import { getNonGenericName, TypeMeta } from '../parse-types.js';

export interface DocWriter {
  getMarkdownContent(def: TypeMeta, typeMap: Record<string, TypeMeta>, knownTypes: Set<string>): string;
}

export function generateDoc(typeMap: Record<string, TypeMeta>, docWriter: DocWriter, outputPath: string) {
  fs.mkdirSync(outputPath, { recursive: true });
  const knownTypes = new Set(Object.keys(typeMap));

  for (const name in typeMap) {
    const typeMeta = typeMap[name];

    // if (name === 'BaseSetting') {
    //   console.log('BaseSetting', def);
    // }

    const filename = getNonGenericName(name);
    let mdPath;
    let markdown;
    mdPath = path.join(outputPath, `${filename}.md`);
    // markdown = this.generateDocImpl(def);
    markdown = docWriter.getMarkdownContent(typeMeta, typeMap, knownTypes);
    fs.writeFileSync(mdPath, markdown, 'utf-8');
    // this.logger.log(`✅ ${filename}.md written`);
  }
}
