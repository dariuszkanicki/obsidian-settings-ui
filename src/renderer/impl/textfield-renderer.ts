import type { Setting, TextAreaComponent, TextComponent } from 'obsidian';
import { css, hint } from '../../utils/helper.js';
import { getDefaultValue, getValue, setValue } from '../../utils/value-utils.js';
import { Textfield, Textarea, Numberfield } from '../types.js';
import { AbstractPathRenderer, PathRendererResult } from './abstract-path-renderer.js';
import { ContextService } from '../../utils/context-service.js';
import { getTranslation } from '../../utils/translation.js';

export class InputfieldRenderer<T> extends AbstractPathRenderer<T> {
  // prettier-ignore
  protected createElement(
    setting: Setting,
    element: Textfield<T> | Textarea<T>
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
        txt.onChange(async value => {
          await setValue(element, value);
          // ContextService.refresh();
        });
        // if (element.validate) {
        //   const { valid, data, invalid, preview } = element.validate(value);
        //   if (preview) {
        //     previewAsHint(this.setting, preview);
        //   }
        // }
        result = { baseComponent: txt, htmlElement: txt.inputEl };
      });
    }
    if (element.placeholder !== undefined) {
      (result.baseComponent as (TextComponent | TextAreaComponent)).setPlaceholder(String(element.placeholder));
    }

    const inputEl = result.htmlElement as HTMLInputElement;

    const _handleInputChange = async () => {
      console.log("_handleInputChange",element);
      let isValid = true;
      const defaultValue = getDefaultValue(element);
      let value = inputEl.value;
      if (value === '' && defaultValue && defaultValue !== '') {
        value = defaultValue;
      } else if (element.validate) {
        const { valid, data, invalid, preview } = element.validate(value);
        if (valid === false) {
          inputEl.setAttr('style', 'border-color: red; border-width: 2px');
          element.hint = getTranslation(element)?.invalid ?? invalid ?? "Invalid value!";
          if (this.hintElement === undefined) {
            this.hintElement = hint(this.setting, element);
          }
          isValid = false;
        } else if (data) {
          value = data;
        }
      }
      if (isValid === true) {
        inputEl.value = value;
        await setValue(element, value);
        ContextService.refresh();
      }
    };

    // inputEl.onblur = async () => {
    //   await _handleInputChange();
    // };

    return result;
  }
}
