import { PathSetting } from '../renderer/types';
import { ContextService } from './context-service';
import { getByPath, setByPath } from './path';

export function coerceValue<T>(original: T, input: any): T {
  if (typeof original === 'number') {
    if (input === '') {
      return 0 as T;
    }
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

function _coerceValue<T>(element: PathSetting<T>, input: any): T {
  if (element.type === 'Numberfield') {
    if (input === '') {
      return 0 as T;
    }
    const parsed = parseFloat(input);
    if (!isNaN(parsed)) {
      return parsed as T;
    } else {
      throw Error('wrong input ' + input);
    }
  }
  if (element.type === 'Toggle') {
    if (input === 'true' || input === true) return true as T;
    if (input === 'false' || input === false) return false as T;
    return false as T;
  }
  return String(input).trim() as T;
}

// TODO  preSave before element.handler?
export async function setValue<T>(element: PathSetting<T>, value: any) {
  if (element.handler) {
    element.handler.setValue(value);
    return;
  }
  const settings = ContextService.settings();

  const current = getByPath(settings, element.path);

  // const coerced = coerceValue(current, value);
  const coerced = _coerceValue(element, value);

  setByPath(settings, element.path, coerced);

  if (element.preSave) {
    element.preSave(coerced);
  }
  await ContextService.saveData(settings);

  if (element.postSave) {
    element.postSave();
  }
}

// export async function setValue<T, P extends Path<T>>(context: ConfigContext<T>, element: PathSetting<T> & { path: P }, value: unknown) {
//   // Determine expected type at compile time
//   type Expected = ValueAtPath<T, P>;
//   const coerced = coerceToType<Expected>(value);

//   setByPath(context.settings, element.path, coerced);

//   if (element.preSave) {
//     element.preSave(coerced);
//   }
//   await context.saveData(context.settings);
// }
// function coerceToType<T>(value: unknown): T {
//   if (typeof value === 'string') {
//     const lower = value.toLowerCase();
//     if (lower === 'true') return true as T;
//     if (lower === 'false') return false as T;
//     const num = Number(value);
//     if (!isNaN(num)) return num as T;
//     return value as T;
//   }

//   return value as T;
// }

// export function getValue<T>(settings: T, element: { path?: Path<T>; handler?: any }) {
//   const value = element.handler ? element.handler.getValue() : getByPath(settings, element.path);
//   return value;
// }

// export function getValue<T>(settings: any, element: { path?: string; handler?: any }) {
export function getValue<T>(element: PathSetting<T>) {
  const settings = ContextService.settings();
  const value = element.handler ? element.handler.getValue() : getByPath(settings, element.path);
  return value;
}
