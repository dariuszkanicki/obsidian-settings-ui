import { Setting } from 'obsidian';
import { highlightAsCode, css } from '../../utils/helper.js';
import { getSettingLabelWidth, getSettingFontSize } from '../../utils/storage.js';
import { translateElementPart } from '../../utils/translation.js';
import type { Replacement } from '../types-api.js';

// prettier-ignore
export function createSetting(
  element: {id?: string, label?: string, replacements?: () => Replacement[] },   //CommonProperties, //BaseSetting | PathSetting<T>,
  container: HTMLElement,
  groupMember: boolean,
  withoutLabel?: boolean
): Setting {

  const setting = new Setting(container);
  if (!withoutLabel) {
    label(element, setting.nameEl);
  }
  _setLabelWith();
  _setLabelFontSize();

  setting.settingEl.addClass(css(groupMember ? 'group-item' : 'item'));
  return setting;

  function _setLabelWith() {
    const width = getSettingLabelWidth();
    if (width) {
      setting.infoEl.style.cssText = `flex-basis: ${width}px!important`;
    }
  }

  function _setLabelFontSize() {
    const fontSize = getSettingFontSize();
    if (fontSize) {
      setting.nameEl.style.cssText = `font-size: ${fontSize}px`;
    }
  }
}

export function label(element: { label?: string; id?: string }, htmlElement: HTMLElement) {
  const labelString = translateElementPart(element, 'label', element.label);

  if (labelString !== undefined) {
    highlightAsCode(htmlElement, labelString);
  } else {
    console.warn('label not specified', element);
    // _updateTranslation();
  }
  // function _updateTranslation<T>() {
  //   const key = 'path' in element ? element.path : (element.id ?? undefined);
  //   if (key) {
  //     ContextService.localizedSettingMap()?.set(key, {
  //       id: key,
  //       label: key,
  //     });
  //     saveMap();
  //   }
  // }
}
