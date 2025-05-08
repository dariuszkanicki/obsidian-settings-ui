import type { Setting, TextAreaComponent, TextComponent } from 'obsidian';
import { css } from '../../utils/helper.js';
import { getValue, setValue } from '../../utils/value-utils.js';
import { Textfield, Textarea, Numberfield } from '../types.js';
import { AbstractPathRenderer, PathRendererResult } from './abstract-path-renderer.js';

export class InputfieldRenderer<T> extends AbstractPathRenderer<T> {
  protected createElement(setting: Setting, element: Textfield<T> | Textarea<T>): PathRendererResult {
    let result!: PathRendererResult;
    if (element.type === 'Textarea') {
      setting.addTextArea((ta) => {
        ta.setValue(getValue(element));
        result = { baseComponent: ta, htmlElement: ta.inputEl };
      });
      setting.infoEl.addClass(css('info-textarea'));
    } else {
      setting.addText((txt) => {
        const value = String(getValue(element));
        txt.setValue(value);
        txt.onChange(async (value) => {
          await setValue(element, value);
        });
        result = { baseComponent: txt, htmlElement: txt.inputEl };
      });
    }
    if (element.placeholder !== undefined) {
      (result.baseComponent as TextComponent | TextAreaComponent).setPlaceholder(String(element.placeholder));
    }
    return result;
  }
}
