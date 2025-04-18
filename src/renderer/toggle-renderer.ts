import { Setting, ToggleComponent } from 'obsidian';
import { Toggle } from '..';
import { AbstractPathRenderer } from './abstract-path-renderer';
import { css } from '../utils/helper';
import { IAbstractRendererResult } from './abstract-renderer';

export class ToggleRenderer<T extends Record<string, any>> extends AbstractPathRenderer<T> {
  // prettier-ignore
  protected createElement(
    pluginId: string, 
    setting: Setting, 
    element: Toggle<T>
  ): IAbstractRendererResult {

    let renderer: IAbstractRendererResult;

    setting.infoEl.addClass(css(pluginId,'dkani-ui-info-toggle'));
    setting.addToggle((toggle) => {
      renderer = { baseComponent: toggle, htmlElement: toggle.toggleEl }
    });
    return renderer;
  }

  renderClassSpecific(): void {
    // const value = this.valueHandler.getValue(element);
    // const textComponent = this._addTextComponent(setting, element, value);
    // if (this.element.customInputClass)
    //   this.textComponent.inputEl.classList.add(element.customInputClass);
    // if (element.placeholder) textComponent.setPlaceholder(element.placeholder);
    // this._renderCommonSettingElements(
    //   setting,
    //   element,
    //   textComponent.inputEl,
    //   textComponent,
    //   value
    // );
  }
  // private _renderCommonSettingElements(
  //   setting: Setting,
  //   element: {
  //     label: string;
  //     path?: Path<T>;
  //     handler?: any;
  //     postSave?: () => void;
  //     desc?: string;
  //     hint?: string;
  //   },
  //   htmlElement: HTMLElement,
  //   valueComponent:
  //     | AbstractTextComponent<HTMLInputElement | HTMLTextAreaElement>
  //     | ToggleComponent,
  //   value: string | boolean | number
  // ) {
  //   htmlElement.classList.add(this.helper.css('dkani-ui-item'));

  //   if (
  //     'setValue' in valueComponent &&
  //     typeof valueComponent.setValue === 'function'
  //   ) {
  //     (valueComponent as any).setValue(value).onChange((val: any) => {
  //       this.valueHandler.setValue(element, val);
  //       if (element.postSave) element.postSave();
  //     });
  //   }

  //   if (element.hint) this.helper.hint(setting, element);
  //   if (element.desc)
  //     setting.controlEl.createEl('small', { text: element.desc });
  // }
}
