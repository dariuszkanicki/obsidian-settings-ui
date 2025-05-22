import path from 'node:path';
import fs from 'node:fs';

import { Logger } from './logger.js';
import { getNonGenericName, PropertyMeta, TypeMeta } from './parse-types.js';
import { DocWriter } from './writer/doc-writer.js';
import { HtmlWriter } from './writer/html-writer.js';
import { parseTypesFromFile } from './parse-typesX.js';

export abstract class AbstractTypes {
  protected logger = new Logger(true);

  private docWriter: DocWriter = new HtmlWriter(); //new MdWriter();
  private typeMap: Record<string, TypeMeta>;
  private knownTypes;
  private className = this.constructor.name;
  private missingBaseTypes: Set<string> = new Set();

  constructor(
    private inputPath: string,
    private outputPath: string,
  ) {
    const filePath = path.resolve(inputPath);
    this.typeMap = parseTypesFromFile(filePath);
    this.knownTypes = new Set(Object.keys(this.typeMap));
    // this._traverseInheritance(this.typeMap);
  }

  getTypeMap() {
    return this.typeMap;
  }
  resetMissingBaseTypes() {
    this.missingBaseTypes.clear();
  }
  getMissingBaseTypes() {
    return this.missingBaseTypes;
  }

  generateDoc() {
    fs.mkdirSync(this.outputPath, { recursive: true });

    for (const name in this.typeMap) {
      const def = this.typeMap[name];

      // if (name === 'BaseSetting') {
      //   console.log('BaseSetting', def);
      // }

      const filename = getNonGenericName(name);
      let mdPath;
      let markdown;
      mdPath = path.join(this.outputPath, `${filename}.md`);
      // markdown = this.generateDocImpl(def);
      markdown = this.docWriter.getMarkdownContent(def, this.typeMap, this.knownTypes);
      fs.writeFileSync(mdPath, markdown, 'utf-8');
      // this.logger.log(`✅ ${filename}.md written`);
    }
  }

  protected resolve = (meta: TypeMeta, typeMap: Record<string, TypeMeta>): void => {
    if (meta.traversed || !meta.extends) return;
    meta.traversed = true;
    meta.inherited = {};

    const baseTypes = meta.extends.split('&').map((s) => s.trim());

    for (const baseName of baseTypes) {
      const base = typeMap[baseName];
      if (!base) {
        this.missingBaseTypes.add(baseName);
        continue;
      }
      // Recursively resolve this base
      this.resolve(base, typeMap);

      // Add its properties
      meta.inherited[base.name] = {
        name: base.name,
        properties: base.properties,
      };

      // Merge its inherited ancestors too
      for (const [ancestorName, record] of Object.entries(base.inherited)) {
        if (!meta.inherited[ancestorName]) {
          meta.inherited[ancestorName] = record;
        }
      }
    }
  };

  private _traverseInheritance(typeMap: Record<string, TypeMeta>): void {
    for (const name in typeMap) {
      const def = typeMap[name];
      if (!def.traversed) {
        this.resolve(def, typeMap);
      }
    }
    this.missingBaseTypes.forEach((baseName) => {
      console.warn(`⚠️  ${this.className}: missing base type '${baseName}'`);
    });
  }

  debugTypeMap() {
    const sortedTypeMap = Object.fromEntries(Object.entries(this.getTypeMap()).sort(([a], [b]) => a.localeCompare(b)));
    // this.logger.log(sortedTypeMap);
    // fs.writeFileSync(path.join(OUTPUT_DIR, '_output.txt'), JSON.stringify(sortedTypeMap, null, 2), 'utf-8');
    // for (const [typeName, def] of Object.entries(typeMap)) {
    //   const debugText = JSON.stringify(def, null, 2);
    //   const txtPath = path.join(OUTPUT_DIR, `${typeName}.txt`);
    //   fs.writeFileSync(txtPath, debugText, 'utf-8');
    // }
    // console.log('📂 Individual .txt debug files written for all types.');
  }
}
// export function nonGenericName(input: string) {
//   const regex = /^(?<name>\w+)(?:<[^>]+>)?$/;
//   const match = input.match(regex);

//   if (match) {
//     const name = match.groups?.name;
//     // console.log('nonGenericName:', name);
//     return name;
//   } else {
//     throw Error(`nonGenericName: can't parse <${input}>`);
//   }
// }
