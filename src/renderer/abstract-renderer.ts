import { BaseComponent, Setting } from 'obsidian';
import { addCodeHighlightedText, css } from '../utils/helper';
import { Context, SettingElement } from '..';

export interface IAbstractRendererResult {
  baseComponent: BaseComponent;
  htmlElement: HTMLElement;
}

export abstract class AbstractRenderer<T extends Record<string, any>> {
  protected result: IAbstractRendererResult;

  // prettier-ignore
  render(
    context: Context<T>, 
    container: HTMLElement, 
    element: SettingElement<T>, 
    groupMember: boolean
  ): Setting {

    const setting = new Setting(container);

    if (element.label) {
      addCodeHighlightedText(setting.nameEl, context.pluginId, element.label);
    }
    setting.settingEl.addClass(css(context.pluginId, groupMember ? 'dkani-ui-group-item' : 'dkani-ui-item'));
    this.result = this.createElement(context.pluginId, setting, element);
    return setting;
  }

  protected abstract createElement(
    pluginId: string,
    setting: Setting,
    element: SettingElement<T>
  ): IAbstractRendererResult;
}
