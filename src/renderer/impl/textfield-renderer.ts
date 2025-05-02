import type { Setting, TextAreaComponent, TextComponent } from 'obsidian';
import { css } from '../../utils/helper.js';
import { getDefaultValue, getValue, setValue } from '../../utils/value-utils.js';
import { Textfield, Textarea, Numberfield } from '../types.js';
import { AbstractPathRenderer, PathRendererResult } from './abstract-path-renderer.js';
import { getDefaultSettings } from 'node:http2';
import { ContextService } from '../../utils/context-service.js';

export class InputfieldRenderer<T> extends AbstractPathRenderer<T> {
  // prettier-ignore
  protected createElement(
    setting: Setting,
    element: Textfield<T> | Textarea<T> | Numberfield<T>
  ): PathRendererResult {

    let result!: PathRendererResult;
    if (element.type === 'Textarea') {
      setting.addTextArea((ta) => {
        ta.setValue(getValue(element));
        result = { baseComponent: ta, htmlElement: ta.inputEl };
      });
      setting.infoEl.addClass(css('info-textarea'));
    } else {
      let noHint = false;
      setting.addText((txt) => {
        txt.setValue(String(getValue(element)));
        console.log("setValue", element, getValue(element));
        if (element.type === 'Numberfield') {
          txt.inputEl.type = 'number';
          txt.inputEl.classList.add(css('item-short'));
          const numberfield = element;
          if (numberfield.unit) {
            setting.controlEl.addClass('number');
            setting.controlEl.createEl('label', { text: `${numberfield.unit}` });
            noHint = true;
          }
        }
        result = { baseComponent: txt, htmlElement: txt.inputEl, noHint: noHint };
      });
    }
    if (element.placeholder !== undefined) {
      // console.log("placeholder",element.placeholder);
      (result.baseComponent as (TextComponent | TextAreaComponent)).setPlaceholder(String(element.placeholder));
    }

    const inputEl = result.htmlElement as HTMLInputElement;

    const _handleInputChange = () => {
      const defaultValue = getDefaultValue(element);
      console.log("defaultValue", defaultValue);
      if (element.type === 'Numberfield') {
        let val = Number(inputEl.value);
        if (!isNaN(val)) {
          if (inputEl.value === '') {
            val = defaultValue;
          } else if (element.min !== undefined && val < element.min) {
            val = element.min;
          } else if (element.max !== undefined && val > element.max) {
            val = element.max;
          }
          inputEl.value = String(val);
          setValue(element, val as number);
        }
      } else {
        let value = inputEl.value;
        if (value === '' && defaultValue && defaultValue !== '') {
          value = defaultValue;
        }
        console.log("setValue", element, value);
        inputEl.value = value;
        setValue(element, value);
      }
      ContextService.refresh();
    };

    inputEl.onblur = () => {
      _handleInputChange();
    };

    return result;
  }
}
