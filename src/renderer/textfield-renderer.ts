import { Setting, TextAreaComponent, TextComponent } from 'obsidian';
import { Textfield } from '..';
import { AbstractPathRenderer } from './abstract-path-renderer';
import { css } from '../utils/helper';
import { IAbstractRendererResult } from './abstract-renderer';

export class TextfieldRenderer<T extends Record<string, any>> extends AbstractPathRenderer<T> {
  // prettier-ignore
  protected createElement(
    pluginId: string, 
    setting: Setting, 
    element: Textfield<T>
  ): IAbstractRendererResult {

    let renderer: IAbstractRendererResult;

    if (element.asTextarea) {
      setting.addTextArea((ta) => {
        renderer = { baseComponent: ta, htmlElement: ta.inputEl };
      });
      setting.infoEl.addClass(css(pluginId,'dkani-ui-info-textarea'));
    } else {
      setting.addText((txt) => {
        txt.inputEl.type = 'number';
        // if (typeof this.value === 'number') {
        //   txt.inputEl.classList.add(css(pluginId,'dkani-ui-item-short'));
        // }
        renderer = { baseComponent: txt, htmlElement: txt.inputEl };
      });
    }
    return renderer;
  }
}
