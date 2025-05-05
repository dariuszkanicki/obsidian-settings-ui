import type { Setting, TextAreaComponent, TextComponent } from 'obsidian';
import { css, hint, previewAsHint } from '../../utils/helper.js';
import { getDefaultValue, getValue, setValue } from '../../utils/value-utils.js';
import { Textfield, Textarea, Numberfield } from '../types.js';
import { AbstractPathRenderer, PathRendererResult } from './abstract-path-renderer.js';
import { getDefaultSettings } from 'node:http2';
import { ContextService } from '../../utils/context-service.js';
import { getTranslation, translation } from '../../utils/translation.js';

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
        const value = String(getValue(element));
        txt.setValue(value);
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
        // if (element.validate) {
        //   const { valid, data, invalid, preview } = element.validate(value);
        //   console.log("element.validate", value, valid, data, preview);
        //   if (preview) {
        //     previewAsHint(this.setting, preview);
        //   }
        // }
        result = { baseComponent: txt, htmlElement: txt.inputEl, noHint: noHint };
      });
    }
    if (element.placeholder !== undefined) {
      (result.baseComponent as (TextComponent | TextAreaComponent)).setPlaceholder(String(element.placeholder));
    }

    const inputEl = result.htmlElement as HTMLInputElement;

    const _handleInputChange = async () => {
      let isValid = true;
      const defaultValue = getDefaultValue(element);
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
          await setValue(element, val as number);
        }
      } else {
        let value = inputEl.value;
        if (value === '' && defaultValue && defaultValue !== '') {
          value = defaultValue;
        } else if (element.validate) {
          const { valid, data, invalid, preview } = element.validate(value);
          console.log("element.validate", value, valid, data, preview);
          if (valid === false) {
            inputEl.setAttr('style', 'border-color: red; border-width: 2px');
            element.hint = getTranslation(element)?.invalid ?? invalid ?? "Invalid value!";
            if (this.hintElement === undefined) {
              this.hintElement = hint(false, this.setting, element);
            }
            isValid = false;
          } else if (data) {
            value = data;
          }
        }
        if (isValid === true) {
          inputEl.value = value;
          await setValue(element, value);
        }
      }
      if (isValid === true) {
        ContextService.refresh();
      }
    };

    inputEl.onblur = () => {
      _handleInputChange();
    };

    return result;
  }
}
