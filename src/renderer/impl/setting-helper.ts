import { Setting } from 'obsidian';
import { addCodeHighlightedText, css } from '../../utils/helper';
import { ConfigContext, BaseSetting, PathSetting } from '../types';
import { getLocalStorage, saveMap } from '../../i18n/loader';

// prettier-ignore
export function createSetting<T extends Record<string, any>>(
  context:      ConfigContext<T>, 
  element:      BaseSetting | PathSetting<T>, 
  container:    HTMLElement, 
  groupMember:  boolean
): Setting {

  const setting = new Setting(container);
  _setLabel();
  _setLabelWith();
  _setLabelFontSize();

  setting.settingEl.addClass(css(context.pluginId, groupMember ? 'dkani-ui-group-item' : 'dkani-ui-item'));
  return setting;

  function _setLabelWith<T>() {
    const width = getLocalStorage(context.plugin, 'settings-label-width');
    if (width) {
      setting.infoEl.style.cssText = `flex-basis: ${width}px!important`;
    }
  }

  function _setLabelFontSize<T>() {
    const fontSize = getLocalStorage(context.plugin, 'settings-font-size');
    if (fontSize) {
      setting.nameEl.style.cssText = `font-size: ${fontSize}px`;
    }
  }




  function _setLabel<T>() {
    const translation = getTranslation(context, element);
    let label: string | undefined;
    if (translation) {
      label = translation.label;
    } else {
      label = element.label;
    }
    if (label !== undefined) {
      addCodeHighlightedText(setting.nameEl, context.pluginId, label);
    } else {
      console.warn('label not specified', element);
      _updateTranslation();
    }
  }
  function _updateTranslation<T extends Record<string, any>>() {
    const key = 'path' in element ? element.path : (element.id ?? undefined);
    if (key) {
      context.settingsMap!.set(key, {
        id: key,
        label: key,
      });
      saveMap(context.plugin, context.settingsMap!);
    }
  }
}

export function getTranslation<T extends Record<string, any>>(context: ConfigContext<T>, element: BaseSetting | PathSetting<T>) {
  const key = 'path' in element ? element.path : element.id ?? '';
  if (key) {
    return context.settingsMap!.get(key);
  }
  return undefined;
}
