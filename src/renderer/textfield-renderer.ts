import { TextAreaComponent, TextComponent } from 'obsidian';
import { Context, Textfield } from '..';
import { AbstractPathRenderer, IValueComponent } from './abstract-path-renderer';

export class TextfieldRenderer<T extends Record<string, any>> extends AbstractPathRenderer<T> {
  constructor(context: Context<T>, groupMember: boolean, protected element: Textfield<T>) {
    super(context, groupMember, element);
  }

  protected createElement(): {
    valueComponent: IValueComponent;
    htmlElement: HTMLElement;
  } {
    let valueComponent!: TextComponent | TextAreaComponent;
    let htmlComponent!: HTMLElement;

    if (this.element.asTextarea) {
      this.setting.addTextArea((ta) => {
        valueComponent = ta;
        htmlComponent = ta.inputEl;
      });
      this.setting.infoEl.addClass(this.helper.css('dkani-ui-info-textarea'));
    } else {
      this.setting.addText((txt) => {
        if (typeof this.value === 'number') {
          txt.inputEl.classList.add(this.helper.css('dkani-ui-item-short'));
        }
        valueComponent = txt;
        htmlComponent = txt.inputEl;
      });
    }
    return { valueComponent: valueComponent, htmlElement: htmlComponent };
  }

  renderClassSpecific(): void {}
}
