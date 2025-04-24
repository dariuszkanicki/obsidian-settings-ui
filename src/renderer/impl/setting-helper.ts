import { Setting } from 'obsidian';
import { addCodeHighlightedText, css, getLocalStorage, getTranslation } from '../../utils/helper';
import { BaseSetting, PathSetting } from '../types';
import { saveMap } from '../../i18n/loader';
import { ContextService } from '../../utils/context-service';

// prettier-ignore
export function createSetting<T>(
  element:      BaseSetting | PathSetting<T>, 
  container:    HTMLElement, 
  groupMember:  boolean
): Setting {

  const setting = new Setting(container);
  setLabel(element,setting.nameEl);
  _setLabelWith();
  _setLabelFontSize();

  setting.settingEl.addClass(css(groupMember ? 'group-item' : 'item'));
  return setting;

  function _setLabelWith<T>() {
    const width = getLocalStorage('settings-label-width');
    if (width) {
      setting.infoEl.style.cssText = `flex-basis: ${width}px!important`;
    }
  }

  function _setLabelFontSize<T>() {
    const fontSize = getLocalStorage('settings-font-size');
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
    addCodeHighlightedText(htmlElement, labelString);
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
