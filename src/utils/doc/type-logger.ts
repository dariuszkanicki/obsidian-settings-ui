import chalk from 'chalk';
import type { PropertyMeta, TypeMeta } from './type-resolver.js';

export function tlog(typeMap: Record<string, TypeMeta>) {
  Object.values(typeMap).map((meta) => {
    if (meta.name === 'Button') {
      console.log('{' + _type(meta.name) + _extends(meta));
      console.log('  properties    : ' + _properties(meta.properties));
      console.log('  flatProperties: ' + _flatProperties(meta));
      console.log('} ');
    }
  });
}
function _extends(meta: TypeMeta) {
  if (meta.extends) {
    return '-> ' + meta.extends;
  }
  return '';
}
function _prop(name: string) {
  return chalk.yellow(name);
}

function _properties(properties: PropertyMeta[]): string {
  if (!properties.length) return '[]';

  const propStrings = properties.map((prop) => {
    const optional = prop.optional ? '?' : '';
    return `${_prop(prop.name)}${optional} ${prop.datatype}`;
    // return `${prop.name}${optional}: ${prop.type}`;
  });
  return `[${propStrings.join(', ')}]`;
}

function _flatProperties(meta: TypeMeta): string {
  if (!meta.properties.length) return '[]';

  const propStrings = meta.flatProperties.map((prop) => {
    const optional = prop.optional ? '?' : '';
    let result = _prop(prop.name) + optional;
    prop.sources.forEach((source) => {
      if (source.type !== meta.name) {
        const via = source.via !== source.type ? `(${source.via})` : '';
        result += `..${source.type}${via}`;
      }
    });
    return result;
  });
  return `[${propStrings.join(', ')}]`;
}

function _type(name: string) {
  return chalk.bgGreen.bold(` ${name} `);
}
