import { Logger } from './logger.js';
import { getNonGenericName, PropertyMeta } from './parse-types.js';

export abstract class AbstractType {
  protected logger = new Logger(true);

  constructor() {
    // const inputs = [
    //   '() => doSomething()',
    //   'doSomething()',
    //   '() => makeArray()[]',
    //   'makeArray()[]',
    //   'string',
    //   '() => x[]',
    //   'x[]',
    //   '(settings: T) => Promise<void>',
    //   '(settings: T) => Promise<void>[] | string[]',
    // ];
    // for (const input of inputs) {
    //   const match = input.match(/^(?:(?<func>\(.*\) => ))?(?<type>.*)$/);
    //   console.log(`Input: ${input}`);
    //   if (match?.groups) {
    //     const { func, type } = match.groups;
    //     console.log('  func: ', func);
    //     console.log('  type: ', type);
    //     const types = type.split('|');
    //   } else {
    //     console.log('  ❌ No match');
    //   }
    // }
  }
  //   private inputPath: string,
  //   private outputPath: string,
  // ) {
  //   const filePath = path.resolve(inputPath);
  //   const source = fs.readFileSync(filePath, 'utf-8');
  //   this.typeMap = parseTypes(source);
  //   this.knownTypes = new Set(Object.keys(this.typeMap));
  // }

  protected typeColumn(property: PropertyMeta, known: Set<string>): string {
    let result;
    // if (property.isFunction) {
    // type: '() => void',
    // type: '(settings: T) => Promise<void>',
    // type: '() => Promise<void>',
    // type: '() => string',
    // type: '() => Replacement[]',
    // type: '(value: any) => { valid: boolean; data?: any; invalid?: string; preview?: string }',
    // type: '() => number | string | boolean | Promise<number | string | boolean>',
    // type: '(value: any) => void | Promise<void>',
    known.forEach((knownType) => {
      const pattern = new RegExp(`^(?<before>[\\s\\S]*?)${knownType}(?<after>[\\s\\S]*)$`);
      const match = property.type.match(pattern);
      if (match?.groups) {
        const { before, after } = match.groups;
        console.log('Before:', before);
        console.log('Found :', knownType);
        console.log('After :', after);
        const name = knownType.replace(/<.*?>/, '');
        result = '';
        if (before) {
          result += '`' + before + '`';
        }
        result += '[`' + knownType + '`](' + name + ')';
        if (after) {
          result += '`' + after + '`';
        }
      }
    });
    if (!result) {
      result = '`' + property.type + '`';
    }
    // }
    return result.replaceAll('|', '\\|');
  }
  protected typeColumn_(value: string, known: Set<string>): string {
    this.logger.log('lib.typeColumn -------------');
    this.logger.log(`VALUE : <${value}>`);

    let match = value.match(/^(?:(?<func>\(\) => ))?(?<type>.*)$/);

    if (!match) {
      console.log(`VALUE : ${value}`);
      throw Error('matching failed');
    }
    const { func, type } = match.groups!;

    this.logger.log(`func  : ${func}`); // "() => "
    this.logger.log(`type  : ${type}`);

    let result: string = '';

    if (func) {
      result = '`' + func + '` ';
    }

    match = value.match(/^(?<clean>[^;]*)(?:; \/\/(?<desc>.*))?$/);

    if (!match?.groups?.clean) {
      throw new Error('Invalid input looking for description');
    }
    const { desc, clean } = match.groups;
    this.logger.log(`clean : ${clean}`);
    this.logger.log(`desc  : ${desc}`);

    const typeArray = clean.replaceAll(' ', '').split('|');

    typeArray.forEach((item, index) => {
      const match = item.match(/^(?<type>.+?)(?<suffix>\[\])?$/);

      if (!match?.groups?.type) {
        throw new Error('Invalid input');
      }
      const { type, suffix } = match.groups;
      this.logger.log(`type   : ${type}`);
      this.logger.log(`suffix : ${suffix}`);

      if (index > 0) {
        result += ' `\\|` ';
      }

      if (known.has(type)) {
        // create link
        const name = type.replace(/<.*?>/, '');
        result += '[`' + type + '`](' + name + '.md)';
      } else {
        result += '`' + type + '`';
      }

      if (suffix) {
        result += ' `[]`';
      }
    });

    if (desc) {
      result += ' | ' + desc;
    }
    this.logger.log(`result  : ${result}`);
    this.logger.log('-------------');

    return result;
  }

  protected typeColum2(value: string, known: Set<string>): string {
    // this.logger.setEnabled(false);
    this.logger.log('lib.typeColumn -------------');
    value = value.trim().replaceAll(' | ', '|');
    this.logger.log(`VALUE : ${value}`);

    const typePattern = /^["]?(?<func>\(\)\s*=>\s*)?(?<type>\w+(?:<[^>]+>)?)(?<suffix>\[\])?['"]?$/;

    const parts = value.split('|');
    const formattedParts: string[] = [];

    let quoteAround = true;
    let funcAsPar = false;
    for (const raw of parts) {
      const part = raw.trim();
      const match = part.match(typePattern);
      if (!match) {
        formattedParts.push(part);
        continue;
      }

      const { func, type, suffix } = match.groups!;
      const name = getNonGenericName(type);

      this.logger.log(`func  : ${func}`);
      this.logger.log(`type  : ${type}`);
      this.logger.log(`name  : ${name}`);
      this.logger.log(`suffix: ${suffix}`);

      let formatted = '';
      if (func) {
        formatted = '`() =>` ';
        funcAsPar = true;
      }
      if (known.has(type)) {
        formatted += '[`' + type + '`](' + name + '.md)';
        quoteAround = false;
      } else {
        formatted += type;
      }
      if (suffix) {
        if (quoteAround) {
          formatted += '';
        } else {
          formatted += '`';
        }
        formatted += suffix;
        if (quoteAround) {
          formatted += '';
        } else {
          formatted += '`';
        }
      }
      formattedParts.push(formatted);
    }
    let result = formattedParts.join(' \\| ');
    if (quoteAround) {
      if (funcAsPar) {
        result = result + '` ';
      } else {
        result = '`' + result + '` ';
      }
    }
    this.logger.log(`result: ${result} ${quoteAround}`);
    this.logger.log('-------------');

    return result;
  }
}
