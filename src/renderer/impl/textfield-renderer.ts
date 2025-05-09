import type { Setting, TextAreaComponent, TextComponent } from 'obsidian';
import { css, hint } from '../../utils/helper.js';
import { getDefaultValue, getValue, setValue } from '../../utils/value-utils.js';
import { Textfield, Textarea } from '../types.js';
import { AbstractPathRenderer, PathRendererResult } from './abstract-path-renderer.js';
import { getTranslation } from '../../utils/translation.js';
import { ContextService } from '../../utils/context-service.js';

export class InputfieldRenderer<T> extends AbstractPathRenderer<T> {
  private inputEl!: HTMLInputElement;
  private oldHint!: string;
  protected createElement(setting: Setting, element: Textfield<T> | Textarea<T>): PathRendererResult {
    let component!: TextComponent | TextAreaComponent;

    if (element.type === 'Textarea') {
      setting.addTextArea((txt) => (component = txt));
      setting.infoEl.addClass(css('info-textarea'));
    } else {
      setting.addText((txt) => {
        component = txt;
        this.inputEl = txt.inputEl;
      });
    }
    component.setValue(getValue(element));
    if (element.placeholder !== undefined) {
      component!.setPlaceholder(String(element.placeholder));
    }
    component!.onChange(async (value: string) => {
      let isValid = true;
      if (value === '') {
        value = getDefaultValue(element);
        component.setValue(value);
      } else if (element.validate) {
        const { valid, data, invalid, preview } = element.validate(value);
        if (valid === false) {
          this.inputEl.style.borderColor = 'red';
          this.inputEl.style.borderWidth = '2px';
          const errorHint = getTranslation(element)?.invalid ?? invalid ?? 'Invalid value!';
          if (this.hintElement === undefined) {
            element.hint = errorHint;
            this.hintElement = hint(this.setting, element);
          } else {
            this.oldHint = this.hintElement.innerHTML;
            this.hintElement.innerHTML = errorHint;
          }
          this.hintElement!.style.color = 'red';
          this.hintElement!.style.fontWeight = '500';
          isValid = false;
        } else if (data) {
          value = data;
        }
      }
      if (isValid === true) {
        this.inputEl.value = value;
        this.inputEl.style.removeProperty('border-color');
        this.inputEl.style.removeProperty('border-width');
        if (this.hintElement !== undefined) {
          if (this.oldHint) {
            this.hintElement.innerHTML = this.oldHint ?? '';
            this.hintElement!.style.removeProperty('color');
            this.hintElement!.style.removeProperty('font-weight');
          }
        }
        await setValue(element, value);
        // ContextService.refresh();
      }
      this.displayDefaultBar(value === getDefaultValue(element));
    });
    return { baseComponent: component, htmlElement: component.inputEl };
  }
}
