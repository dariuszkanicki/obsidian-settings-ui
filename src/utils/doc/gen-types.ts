import path from 'node:path';
import fs from 'node:fs';
import { Logger } from './logger.js';
import { getNonGenericName, parseTypes, TypeAliasMeta } from './parse-types.js';
import { TypeDefinition } from './lib.js';
import { AbstractType } from './abstract-type.js';

export class GenTypes extends AbstractType {
  typeMap: Record<string, TypeAliasMeta>;
  knownTypes;

  constructor(
    private inputPath: string,
    private outputPath: string,
  ) {
    super();
    const filePath = path.resolve(inputPath);
    this.typeMap = parseTypes(filePath);
    this.knownTypes = new Set(Object.keys(this.typeMap));
  }

  debugTypeMap() {
    const sortedTypeMap = Object.fromEntries(Object.entries(this.typeMap).sort(([a], [b]) => a.localeCompare(b)));
    // this.logger.log(sortedTypeMap);
    // fs.writeFileSync(path.join(OUTPUT_DIR, '_output.txt'), JSON.stringify(sortedTypeMap, null, 2), 'utf-8');
    // for (const [typeName, def] of Object.entries(typeMap)) {
    //   const debugText = JSON.stringify(def, null, 2);
    //   const txtPath = path.join(OUTPUT_DIR, `${typeName}.txt`);
    //   fs.writeFileSync(txtPath, debugText, 'utf-8');
    // }
    // console.log('📂 Individual .txt debug files written for all types.');
  }

  traverseInheritance(typeMap: Record<string, TypeAliasMeta>): void {
    for (const name in typeMap) {
      const def = typeMap[name];
      if (!def.traversed) {
        resolve(def);
      }
    }

    function resolve(def: TypeAliasMeta): void {
      if (def.traversed) return;
      def.traversed = true;

      def.inherited = {};

      if (!def.extends) return;

      const baseTypes = def.extends.split('&').map((s) => s.trim());

      for (const baseName of baseTypes) {
        const base = typeMap[baseName];
        if (!base) {
          console.warn(`⚠️ Missing base type: ${baseName}`);
          continue;
        }

        // Recursively resolve this base
        resolve(base);

        // Add its properties
        def.inherited[base.name] = {
          inheritedFrom: base.name,
          properties: base.properties,
        };

        // Merge its inherited ancestors too
        for (const [ancestorName, record] of Object.entries(base.inherited)) {
          if (!def.inherited[ancestorName]) {
            def.inherited[ancestorName] = record;
          }
        }
      }
    }
  }

  generateDoc() {
    fs.mkdirSync(this.outputPath, { recursive: true });

    for (const name in this.typeMap) {
      const def = this.typeMap[name];
      const filename = getNonGenericName(name);
      let mdPath;
      let markdown;
      mdPath = path.join(this.outputPath, `${filename}.md`);
      markdown = this._generateAPI(def);
      fs.writeFileSync(mdPath, markdown, 'utf-8');
      this.logger.log(`✅ ${filename}.md written`);
    }
  }

  private _generateAPI(def: TypeAliasMeta): string {
    const lines: string[] = [`# \`${def.name}\``];

    if (def.extends) {
      lines.push(`**Extends:** ${def.extends}`);
    }

    this.logger.log('---x');
    if (def.properties) {
      lines.push('## Properties');
      lines.push('| Name | Type | Description |');
      lines.push('| ---- | ---- | ----------- |');
      def.properties.forEach((property) => {
        if (property.name === 'type') {
          lines.push(`| \`${property.name}\` | \`${property.type}\` | |`);
        } else {
          if (property.optional) {
            lines.push(`| \`${property.name}?\` | ${this.typeColumn(property, this.knownTypes)} | |`);
          } else {
            lines.push(`| \`${property.name}\` | ${this.typeColumn(property, this.knownTypes)} | |`);
          }
        }
      });
      for (const name in def.inherited) {
        const inherited = def.inherited[name];
        lines.push(`| \`${name}\` | --- | |`);
        inherited.properties.forEach((property) => {
          if (property.name === 'type') {
            lines.push(`| \`${property.name}\` | \`${property.type}\` | |`);
          } else {
            if (property.optional) {
              lines.push(`| \`${property.name}?\` | ${this.typeColumn(property, this.knownTypes)} | |`);
            } else {
              lines.push(`| \`${property.name}\` | ${this.typeColumn(property, this.knownTypes)} | |`);
            }
          }
        });
      }
    }
    return lines.join('\n');
  }
}
