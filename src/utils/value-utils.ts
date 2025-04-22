import { ConfigContext, PathSetting } from '../renderer/types';
import { getByPath, setByPath } from './path';

export function coerceValue<T>(original: T, input: any): T {
  if (typeof original === 'number') {
    const parsed = parseFloat(input);
    return isNaN(parsed) ? original : (parsed as T);
  }

  if (typeof original === 'boolean') {
    if (input === 'true' || input === true) return true as T;
    if (input === 'false' || input === false) return false as T;
    return original;
  }

  return String(input).trim() as T;
}

export async function setValue<T extends Record<string, any>>(
  context: ConfigContext<T>,
  element: PathSetting<T>,
  value: any
) {
  if (element.handler) {
    element.handler.setValue(value);
    return;
  }

  const current = getByPath(context.settings, element.path);
  const coerced = coerceValue(current, value);
  setByPath(context.settings, element.path, coerced);

  if (element.preSave) {
    element.preSave(coerced);
  }
  await context.saveData(context.settings);
}

// export function getValue<T>(settings: T, element: { path?: Path<T>; handler?: any }) {
//   const value = element.handler ? element.handler.getValue() : getByPath(settings, element.path);
//   return value;
// }

// export function getValue<T>(settings: any, element: { path?: string; handler?: any }) {
export function getValue<T extends Record<string, any>>(settings: any, element: PathSetting<T>) {
  const value = element.handler ? element.handler.getValue() : getByPath(settings, element.path);
  return value;
}
