import Pickr from '@simonwep/pickr';

import { AbstractPathRenderer, PathRendererResult } from './abstract-path-renderer.js';
import { RGB, Setting } from 'obsidian';
import { plugin } from 'postcss';
import { Textfield, Textarea, Numberfield, Colorpicker } from '../types.js';
import { getValue, setValue } from '../../utils/value-utils.js';
import { colord } from 'colord';

export class ColorpickerRenderer<T> extends AbstractPathRenderer<T> {
  // prettier-ignore
  protected createElement(
    setting: Setting,
    element: Colorpicker<T>
  ): PathRendererResult {

    let result!: PathRendererResult;
    const value = getValue(element);
    console.log("value", value, typeof value);
    const colorRGB = colord(value).toHex();
    setting.addColorPicker((color) => {
      color
        .setValue(colorRGB)
        .onChange(async (newValue) => {
          setValue(element, newValue);
          // await this.saveSettings?.();
        });
    });
    setting.addText((txt) => {
      const value = String(getValue(element));
      txt.setValue(value);
      result = { baseComponent: txt, htmlElement: txt.inputEl };
    });
    return result;
  }
}

