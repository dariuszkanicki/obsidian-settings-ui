import { Setting, TextAreaComponent, TextComponent } from 'obsidian';
import { css } from '../../utils/helper';
import { AbstractPathRenderer, PathRendererResult } from './abstract-path-renderer';
import { Numberfield, Textarea, Textfield } from '../types';
import { setValue } from '../../utils/value-utils';

export class InputfieldRenderer<T> extends AbstractPathRenderer<T> {
  // prettier-ignore
  protected createElement(
    setting: Setting, 
    element: Textfield<T> | Textarea<T> | Numberfield<T>
  ): PathRendererResult {

    let result!: PathRendererResult;
    if (element.type === 'Textarea') {
      setting.addTextArea((ta) => {
        result = { baseComponent: ta, htmlElement: ta.inputEl };
      });
      setting.infoEl.addClass(css('info-textarea'));
    } else {
      let noHint = false;
      setting.addText((txt) => {
        if (element.type === 'Numberfield') {
          txt.inputEl.type = 'number';
          txt.inputEl.classList.add(css('item-short'));
          const numberfield = element as Numberfield<T>;
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
      (result.baseComponent as (TextComponent | TextAreaComponent)).setPlaceholder(String(element.placeholder));
    }

    const inputEl = result.htmlElement as HTMLInputElement;

    const _handleInputChange = () => {
      if (element.type === 'Numberfield') {
        let val = Number(inputEl.value);
        if (!isNaN(val)) {
          if (element.min !== undefined && val < element.min) {
            val = element.min;
          }
          if (element.max !== undefined && val > element.max) {
            val = element.max;
          }
          inputEl.value = String(val);
          setValue(element, val);
        }
      } else {
        setValue(element, inputEl.value);
      }
    }

    inputEl.onkeydown = (ev: KeyboardEvent) => {
      if (ev.key === 'Enter' || ev.key === 'Tab') {
        _handleInputChange();
      }
    };
    inputEl.onblur = () => {
      _handleInputChange();
    };
    
    return result;
  }
}
