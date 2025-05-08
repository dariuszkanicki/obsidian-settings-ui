import { Setting } from 'obsidian';
import { highlightAsCode, css } from '../../utils/helper.js';
import { saveMap } from '../../i18n/loader.js';
import { ContextService } from '../../utils/context-service.js';
import { getSettingLabelWidth, getSettingFontSize } from '../../utils/storage.js';
import { BaseSetting, PathSetting } from '../types.js';
import { getTranslation } from '../../utils/translation.js';

// prettier-ignore
export function createSetting<T>(
  element: BaseSetting | PathSetting<T>,
  container: HTMLElement,
  groupMember: boolean
): Setting {

  const setting = new Setting(container);
  setLabel(element, setting.nameEl);
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

  function _updateTranslation<T>() {
    const key = 'path' in element ? element.path : (element.id ?? undefined);
    if (key) {
      ContextService.settingsMap().set(key, {
        id: key,
        label: key,
      });
      saveMap();
    }
  }
}

export function replacePlaceholders(template: string, replacements: string[]): string {
  return template.replace(/\$\{(\d+)\}/g, (_, index) => {
    const i = parseInt(index, 10) - 1;
    return replacements[i] ?? '';
  });
}

export function setLabel<T>(element: BaseSetting, htmlElement: HTMLElement) {
  const translation = getTranslation(element);
  let labelString = element.label;

  if (translation && translation.label) {
    labelString = translation.label;
    if (labelString && element.labelParameters) {
      labelString = replacePlaceholders(labelString, element.labelParameters);
    }
  }

  if (labelString !== undefined) {
    highlightAsCode(htmlElement, labelString);
  } else {
    console.warn('label not specified', element);
    // _updateTranslation();
  }
}

export function getLabel<T>(element: BaseSetting) {
  const translation = getTranslation(element);
  let labelString = element.label;

  if (translation && translation.label) {
    labelString = translation.label;
    if (labelString && element.labelParameters) {
      labelString = replacePlaceholders(labelString, element.labelParameters);
    }
  }

  if (labelString !== undefined) {
    return labelString;
  } else {
    console.warn('label not specified', element);
    return labelString;
  }
}
