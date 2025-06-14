import type { PathSetting } from '../renderer/types.js';
import { ContextService } from './context-service.js';
import { setByPath, getByPath } from './path.js';

export function coerceValue<T>(element: PathSetting<T>, input: any): T {
  if (element.type === 'Numberfield') {
    if (input === '') {
      return 0 as T;
    }
    const parsed = parseFloat(String(input));
    if (!isNaN(parsed)) {
      return parsed as T;
    } else {
      throw Error(`wrong input ${String(input)}`);
    }
  }
  if (element.type === 'Toggle') {
    if (input === 'true' || input === true) return true as T;
    if (input === 'false' || input === false) return false as T;
    return false as T;
  }
  if (element.type === 'ColorPicker') {
    return input as T;
  }
  return String(input).trim() as T;
}

export async function setValue<T>(element: PathSetting<T>, value: any) {
  const _value = value;
  if (element.handler) {
    await element.handler.setValue(value);
    return;
  } else if (!element.path) {
    console.error('neither path nor handler specified for ', element);
  }

  const settings = ContextService.settings();
  const coerced = coerceValue(element, _value);
  setByPath(settings, element.path, coerced);

  if (element.preSave) {
    // console.log('presave', element, coerced);
    await element.preSave(coerced);
    // console.log('presave done');
  }
  // console.log('saveData', settings);
  await ContextService.saveData(settings);

  if (element.postSave) {
    await element.postSave();
  }
}

export function getValue<T>(element: PathSetting<T>): any {
  const settings = ContextService.settings();
  const value = element.handler ? element.handler.getValue() : getByPath(settings, element.path);
  return value;
}
export function getDefaultValue<T>(element: PathSetting<T>): any {
  if (element.handler) {
    return undefined;
  }
  const settings = ContextService.defaults();
  const value = getByPath(settings, element.path);
  return value;
}
