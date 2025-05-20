import { TypeAliasMeta } from './parse-types.js';
import { AbstractTypes } from './abstract-types.js';

export class ApiTypes extends AbstractTypes {
  constructor(inputPath: string, outputPath: string) {
    super(inputPath, outputPath);
  }

  populateInheritedFromBasis(basisMap: Record<string, TypeAliasMeta>): void {
    const allTypes: Record<string, TypeAliasMeta> = {
      ...basisMap,
      ...this.getTypeMap(),
    };
    this.resetMissingBaseTypes();
    for (const name in this.getTypeMap()) {
      const meta = this.getTypeMap()[name];
      if (name === 'Textfield<T>') {
        console.log(JSON.stringify(meta, null, 2));
      }
      meta.traversed = false;
      this.resolve(meta, allTypes);
      if (name === 'Textfield<T>') {
        console.log(JSON.stringify(meta, null, 2));
      }
    }
    this.getMissingBaseTypes().forEach((baseName) => {
      console.warn(`⚠️  ApiTypes: missing base type '${baseName}'`);
    });
  }
}
