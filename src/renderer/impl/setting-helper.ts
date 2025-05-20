import { Setting } from 'obsidian';
import { highlightAsCode, css } from '../../utils/helper.js';
import { getSettingLabelWidth, getSettingFontSize } from '../../utils/storage.js';
import { BaseSetting, CommonProperties, PathSetting } from '../types.js';
import { translateElementPart } from '../../utils/translation.js';

// prettier-ignore
export function createSetting<T>(
  element: {id?: string, label?: string, withoutLabel?: boolean}, //CommonProperties, //BaseSetting | PathSetting<T>,
  container: HTMLElement,
  groupMember: boolean
): Setting {

  const setting = new Setting(container);
  if (!element.withoutLabel) {
    label(element, setting.nameEl);
  }
  _setLabelWith();
  _setLabelFontSize();

  setting.settingEl.addClass(css(groupMember ? 'group-item' : 'item'));
  return setting;

  function _setLabelWith<T>() {
    const width = getSettingLabelWidth();
    if (width) {
      setting.infoEl.style.cssText = `flex-basis: ${width}px!important`;
    }
  }

  function _setLabelFontSize<T>() {
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
