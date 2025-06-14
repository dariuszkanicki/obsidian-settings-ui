import type { LocalizedSetting, Replacement } from '../renderer/types-api.js';
import type { DropdownItem } from '../renderer/types-api.js';
import type { Dropdown, ColorDropdown } from '../renderer/types-api.js';
import type { Button } from '../renderer/types-api.js';
import { ContextService } from './context-service.js';

function _defaultKey(element: { path?: string; id?: string }): string {
  return 'path' in element ? element.path! : (element.id ?? '');
}

function _dropdownKey<T>(dropdown: Dropdown<T> | ColorDropdown<T>, item: DropdownItem) {
  return `${dropdown.path}.${item.id}`;
}

function _applyReplacements(
  element: { path?: string; id?: string },
  template: string,
  replacements: { name: string; text: string }[],
): string {
  return template.replace(/\$\{(\w+)\}/g, (_, key) => {
    const replacement = replacements.find((r) => r.name === key);
    const result = replacement?.text ?? `<<${key}>>`;
    if (result === `<<${key}>>`) {
      console.warn(`missing replacement '${key}' for id '${element.path || element.id}'`);
    }
    return result;
  });
}

export function translateDropdownItemLabel<T>(dropdown: Dropdown<T> | ColorDropdown<T>, item: DropdownItem): string {
  const localizedSetting = ContextService.localizedSettingMap()?.get(_dropdownKey(dropdown, item));
  if (localizedSetting && localizedSetting.label) {
    return localizedSetting.label;
  } else {
    return item.label ?? item.id;
  }
}

export function translateDropdownItemLabelById<T>(dropdown: Dropdown<T> | ColorDropdown<T>, id: string): string {
  const localizedSetting = ContextService.localizedSettingMap()?.get(id);
  if (localizedSetting && localizedSetting.label) {
    return localizedSetting.label;
  } else {
    return id;
  }
}

export function translateButtonText(button: Button): string {
  // const element = button as CommonPropertiesWithId;
  const localizedSetting = ContextService.localizedSettingMap()?.get(_defaultKey(button));
  if (localizedSetting && localizedSetting.buttonText) {
    return localizedSetting.buttonText;
  } else if (button.buttonText) {
    return button.buttonText;
  } else {
    console.warn('buttonText not specified for ', button.id);
    return button.id ?? '???';
  }
}

export function translateElementPart(
  element: { path?: string; id?: string; replacements?: () => Replacement[] },
  part: string,
  fallback?: string | string[],
): string | undefined {
  // console.log('element', element);
  const localizedSetting = ContextService.localizedSettingMap()?.get(_defaultKey(element));
  let localizedItem = localizedSetting ? localizedSetting[part as keyof LocalizedSetting] : undefined;

  if (localizedItem && Array.isArray(localizedItem)) {
    localizedItem = localizedItem.join('\n');
  }
  if (localizedItem && element.replacements) {
    localizedItem = _applyReplacements(element, localizedItem, element.replacements());
  }

  if (!localizedItem && !fallback && part === 'label') {
    console.warn(`label not found, neither in element nor in translation path/id '${element.path || element.id}'`);
  }
  if (!localizedItem && fallback) {
    if (Array.isArray(fallback)) {
      return fallback.join('\n');
    }
    return fallback;
  }
  return localizedItem;
}

export function localizedSetting4Text(id: string) {
  return ContextService.localizedSettingMap()?.get(id);
}
export function localizedSetting(element: { path?: string; id?: string }) {
  return ContextService.localizedSettingMap()?.get(_defaultKey(element));
}
