import { Context, Dropdown, Textfield, Toggle } from '..';
import { ValueHandler } from '../value-handler';
import { AbstractElement } from './abstract-renderer';

export interface IValueComponent {
  setValue(val: any): this;
  onChange(callback: (val: any) => void): this;
}

export abstract class AbstractPathRenderer<T extends Record<string, any>> extends AbstractElement<T> {
  protected value: number | string | boolean;
  protected valueHandler: ValueHandler<T>;

  constructor(
    protected context: Context<T>,
    groupMember: boolean,
    protected element: Textfield<T> | Toggle<T> | Dropdown<T>
  ) {
    super(context, element.label, groupMember);
    this.valueHandler = new ValueHandler(this.context.settings, this.context.saveData);
  }
  render(): void {
    super.render();
    this.value = this.valueHandler.getValue(this.element);
    const { valueComponent, htmlElement } = this.createElement();
    this._renderCommonSettingElements(htmlElement, valueComponent);
  }

  protected abstract createElement(): { valueComponent: IValueComponent; htmlElement: HTMLElement };

  private _renderCommonSettingElements(htmlElement: HTMLElement, valueComponent: IValueComponent) {
    htmlElement.classList.add(this.helper.css('dkani-ui-item'));
    if ('setValue' in valueComponent && typeof valueComponent.setValue === 'function') {
      (valueComponent as any).setValue(this.value).onChange((val: any) => {
        this.valueHandler.setValue(this.element, val);
        if (this.element.postSave) {
          this.element.postSave();
        }
      });
    }

    if (this.element.hint) {
      this.helper.hint(this.setting, this.element);
    }
    if (this.element.desc) {
      this.setting.controlEl.createEl('small', { text: this.element.desc });
    }
  }
}
