import { Setting } from 'obsidian';
import { css } from '../../utils/helper';
import { AbstractPathRenderer, PathRendererResult } from '../abstract-path-renderer';
import { Textfield } from '../types';

export class TextfieldRenderer<T extends Record<string, any>> extends AbstractPathRenderer<T> {
  // prettier-ignore
  protected createElement(
    pluginId: string, 
    setting: Setting, 
    element: Textfield<T>
  ): PathRendererResult {

    let result: PathRendererResult;

    if (element.asTextarea) {
      setting.addTextArea((ta) => {
        result = { baseComponent: ta, htmlElement: ta.inputEl };
      });
      setting.infoEl.addClass(css(pluginId,'dkani-ui-info-textarea'));
    } else {
      setting.addText((txt) => {
        txt.inputEl.type = 'number';
        // if (typeof this.value === 'number') {
        //   txt.inputEl.classList.add(css(pluginId,'dkani-ui-item-short'));
        // }
        result = { baseComponent: txt, htmlElement: txt.inputEl };
      });
    }
    return result;
  }
}
