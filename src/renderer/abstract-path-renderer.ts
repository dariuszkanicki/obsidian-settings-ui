import { BaseComponent, Setting } from 'obsidian';
import { Context, SettingElement } from '..';
import { AbstractRenderer, IAbstractRendererResult } from './abstract-renderer';
import { css, hint } from '../utils/helper';
import { getValue, setValue } from '../utils/value-utils';

export abstract class AbstractPathRenderer<T extends Record<string, any>> extends AbstractRenderer<T> {
  // prettier-ignore
  render(
    context: Context<T>, 
    container: HTMLElement, 
    element: SettingElement<T>, 
    groupMember: boolean
  ): Setting {
  
    const setting = super.render(context, container, element, groupMember);
    
    this._renderCommonSettingElements(
      context, 
      setting, 
      this.result.htmlElement, 
      element,
      this.result.baseComponent
    );
    return setting;
  }

  protected abstract createElement(
    pluginId: string,
    setting: Setting,
    element: SettingElement<T>
  ): IAbstractRendererResult;

  private async _renderCommonSettingElements(
    context: Context<T>,
    setting: Setting,
    htmlElement: HTMLElement,
    element: SettingElement<T>,
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
