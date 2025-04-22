import { Setting } from 'obsidian';
import { css } from '../../utils/helper';
import { AbstractPathRenderer, PathRendererResult } from './abstract-path-renderer';
import { Textfield } from '../types';
import { getValue } from '../../utils/value-utils';

export class TextfieldRenderer<T extends Record<string, any>> extends AbstractPathRenderer<T> {
  // prettier-ignore
  protected createElement(
    pluginId: string, 
    setting: Setting, 
    element: Textfield<T>
  ): PathRendererResult {

    let result!: PathRendererResult;

    if (element.asTextarea) {
      setting.addTextArea((ta) => {
        result = { baseComponent: ta, htmlElement: ta.inputEl };
      });
      setting.infoEl.addClass(css(pluginId,'dkani-ui-info-textarea'));
    } else {
      setting.addText((txt) => {
        const dataType = typeof getValue(this.context.settings, element);
        if (dataType === 'number') {
          txt.inputEl.type = 'number';
          txt.inputEl.classList.add(css(pluginId,'dkani-ui-item-short'));
        }
        result = { baseComponent: txt, htmlElement: txt.inputEl };
      });
    }
    return result;
  }
}
