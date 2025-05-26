import { PathSetting } from '../renderer/types.js';
import { ContextService } from './context-service.js';
import { setByPath, getByPath } from './path.js';

export function coerceValue<T>(element: PathSetting<T>, input: number | boolean | string | null): any {
  if (element.type === 'Numberfield') {
    if (input === '') {
      return 0;
    }
    const parsed = parseFloat(String(input));
    if (!isNaN(parsed)) {
      return parsed;
    } else {
      throw Error('wrong input ' + input);
    }
  }
  if (element.type === 'Toggle') {
    if (input === 'true' || input === true) return true;
    if (input === 'false' || input === false) return false;
    return false;
  }
  if (element.type === 'ColorPicker') {
    return input;
  }
  return String(input).trim();
}

// TODO  preSave before element.handler?
export async function setValue<T>(element: PathSetting<T>, value: any) {
  let _value = value;
  if (element.handler) {
    const handlerValue = element.handler.setValue(value);
    return;
    // if (handlerValue) {
    //   _value = handlerValue;
    // }
  } else if (!element.path) {
    console.error('neither path nor handler specified for ', element);
  }

  const settings = ContextService.settings();
  const coerced = coerceValue(element, _value);
  setByPath(settings, element.path!, coerced);

  if (element.preSave) {
    console.log('presave', element, coerced);
    await element.preSave(coerced);
    console.log('presave done');
  }
  console.log('saveData', settings);
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
export function getValue<T>(element: PathSetting<T>): any {
  const settings = ContextService.settings();
  const value = element.handler ? element.handler.getValue() : getByPath(settings, element.path!);
  return value as T;
}
export function getDefaultValue<T>(element: PathSetting<T>): any {
  if (element.handler) {
    return undefined;
  }
  const settings = ContextService.defaults();
  const value = getByPath(settings, element.path!);
  return value as T;
}
