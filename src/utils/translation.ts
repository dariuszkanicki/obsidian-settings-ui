import { replacePlaceholders } from '../renderer/impl/setting-helper.js';
import { BaseSetting, PathSetting, LocalizedSetting, DropdownItem, Dropdown, ColorDropdown } from '../renderer/types.js';
import { ContextService } from './context-service.js';

function _defaultKey(element: { path?: string; id?: string }): string {
  return 'path' in element ? element.path! : (element.id ?? '');
}

function _dropdownKey<T>(dropdown: Dropdown<T> | ColorDropdown<T>, item: DropdownItem) {
  return `${dropdown.path}.${item.id}`;
}

export function getTranslation(element: { path?: string; id?: string }) {
  return ContextService.settingsMap().get(_defaultKey(element));
}

export function translateDropdownItem<T>(dropdown: Dropdown<T> | ColorDropdown<T>, item: DropdownItem, elementString?: string) {
  const translation = ContextService.settingsMap().get(_dropdownKey(dropdown, item));
  let result = elementString;
  const translated = translation ? translation.label : undefined;
  if (translated) {
    result = translated;
  }
  return result;
}
export function translateDropdownItemById<T>(dropdown: Dropdown<T> | ColorDropdown<T>, id: string) {
  let result = undefined;
  const translation = ContextService.settingsMap().get(id);
  const translated = translation ? translation.label : undefined;
  if (translated) {
    result = translated;
  }
  return result;
}

export function translateArray(
  element: { path?: string; id?: string },
  item: string,
  index: number,
  elementString?: string,
  replacements?: string[],
) {
  const translation = getTranslation(element);
  let result = elementString;
  let translated;
  let translatedArray = translation ? translation[item as keyof LocalizedSetting] : undefined;
  console.log('translatedArray', translatedArray);
  if (Array.isArray(translatedArray)) {
    translated = translatedArray[index];
  }
  if (translated) {
    if (replacements) {
      result = replacePlaceholders(translated, replacements);
    } else {
      result = translated;
    }
  }
  return result;
}

export function translateString(element: { path?: string; id?: string }, item: string, elementString?: string, replacements?: string[]) {
  const translation = getTranslation(element);
  let result = elementString;
  let translated = translation ? translation[item as keyof LocalizedSetting] : undefined;
  if (translated && Array.isArray(translated)) {
    translated = translated.join('\n');
  }
  if (translated) {
    if (replacements) {
      result = replacePlaceholders(translated, replacements);
    } else {
      result = translated;
    }
  }
  if (!result) {
    console.warn(`translation not found for path/id '${element.path || element.id}'`);
  }
  return result;
}

export function translation(element: { path?: string; id?: string }, item: string, elementString?: string[], replacements?: string[]) {
  const translation = getTranslation(element);
  let result = elementString?.join('\n');
  let translated = translation ? translation[item as keyof LocalizedSetting] : undefined;
  if (translated && Array.isArray(translated)) {
    translated = translated.join('\n');
  }
  if (translated) {
    if (replacements) {
      result = replacePlaceholders(translated, replacements);
    } else {
      result = translated;
    }
  }
  return result;
}

export function textTranslation(id: string) {
  const result = ContextService.settingsMap().get(id);
  return result;
}
