import { BaseComponent, Setting } from 'obsidian';
import { ConfigContext, PathSetting } from './types';
import { createSetting } from './abstract-base-renderer';
import { css, hint } from '../utils/helper';
import { getValue, setValue } from '../utils/value-utils';

export type PathRendererResult = {
  baseComponent: BaseComponent;
  htmlElement: HTMLElement;
};

export abstract class AbstractPathRenderer<T extends Record<string, any>> {
  constructor(private context: ConfigContext<T>, private element: PathSetting<T>) {}

  render(container: HTMLElement, groupMember: boolean) {
    const setting = createSetting(this.context.pluginId, this.element, container, groupMember);
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

    if (element.hint) {
      hint(context.pluginId, setting, element);
    }
    if (element.desc) {
      setting.controlEl.createEl('small', { text: element.desc });
    }
  }
}
