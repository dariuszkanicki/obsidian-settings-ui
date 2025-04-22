import { BaseComponent, Setting } from 'obsidian';
import { ConfigContext, PathSetting } from '../types';
import { css, hint } from '../../utils/helper';
import { getValue, setValue } from '../../utils/value-utils';
import { createSetting, getTranslation } from './setting-helper';
import { getLocalStorage } from '../../i18n/loader';

export type PathRendererResult = {
  baseComponent: BaseComponent;
  htmlElement: HTMLElement;
};

export abstract class AbstractPathRenderer<T extends Record<string, any>> {
  constructor(protected context: ConfigContext<T>, private element: PathSetting<T>) {}

  render(container: HTMLElement, groupMember: boolean) {
    const setting = createSetting(this.context, this.element, container, groupMember);
    const result = this.createElement(this.context.pluginId, setting, this.element);
    this._renderCommonSettingElements(this.context, setting, result.htmlElement, this.element, result.baseComponent);
    return setting;
  }

  protected abstract createElement(pluginId: string, setting: Setting, element: PathSetting<T>): PathRendererResult;

  private async _renderCommonSettingElements(
    context: ConfigContext<T>,
    setting: Setting,
    htmlElement: HTMLElement,
    element: PathSetting<T>,
    baseComponent: BaseComponent
  ) {
    htmlElement.classList.add(css(context.pluginId, 'dkani-ui-item'));
    if ('setValue' in baseComponent && typeof baseComponent.setValue === 'function') {
      const value = getValue(context.settings, element);
      if (typeof value === 'number') {
        (baseComponent as any).setValue(String(value));
      } else {
        (baseComponent as any).setValue(value);
      }
      (baseComponent as any).onChange(async (val: any) => {
        await setValue(context, element, val);
        if (element.postSave) {
          element.postSave();
        }
      });
    }

    const translation = getTranslation(context, element);

    if (translation && translation.hint) {
      hint(context.pluginId, setting, element.path, translation.hint);
    } else if (element.hint) {
      hint(context.pluginId, setting, element.path, element.hint);
    }

    let small: HTMLElement | undefined;
    if (translation && translation.desc) {
      small = setting.controlEl.createEl('small', { text: translation.desc });
    } else if (element.desc) {
      small = setting.controlEl.createEl('small', { text: element.desc });
    }

    const fontSize = getLocalStorage(this.context.plugin, 'settings-font-size');
    if (fontSize) {
      const scale = fontSize / 14;
      if (element.type === 'Toggle') {
        const margin = (1 - scale) * -20;
        htmlElement.setAttr('style', `transform: scale(${scale}); margin-left: ${margin}px`);
      } else {
        htmlElement.setAttr('style', `font-size: ${fontSize}px`);
      }
      if (small) {
        let smallSize = 0.9 * fontSize;
        if (smallSize < 8) {
          smallSize = 8;
        }
        small.setAttr('style', `font-size: ${smallSize}px`);
      }
    }
  }
}
