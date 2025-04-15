import { TextAreaComponent, TextComponent, ToggleComponent } from 'obsidian';
import { Context, Textfield, Toggle } from '..';
import { AbstractPathRenderer, IValueComponent } from './abstract-path-renderer';

export class ToggleRenderer<T extends Record<string, any>> extends AbstractPathRenderer<T> {
  constructor(
    context: Context<T>,
    groupMember: boolean,
    protected element: Toggle<T>
  ) {
    super(context, groupMember, element);
  }

  protected createElement(): {
    valueComponent: IValueComponent;
    htmlElement: HTMLElement;
  } {
    let valueComponent!: ToggleComponent;
    let htmlComponent!: HTMLElement;

    this.setting.infoEl.addClass(this.helper.css('dkani-ui-info-toggle'));
    this.setting.addToggle((toggle) => {
      valueComponent = toggle;
      htmlComponent = toggle.toggleEl;
    });
    return { valueComponent: valueComponent, htmlElement: htmlComponent };
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
