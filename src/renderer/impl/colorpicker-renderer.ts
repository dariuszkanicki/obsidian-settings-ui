import type { PathRendererResult } from './abstract-path-renderer.js';
import { AbstractPathRenderer } from './abstract-path-renderer.js';
import type { ColorComponent, Setting } from 'obsidian';
import type { ColorPicker } from '../types-api.js';
import { getValue, setValue } from '../../utils/value-utils.js';
import { colord } from 'colord';
import { css } from '../../utils/helper.js';
import { ContextService } from '../../utils/context-service.js';
import { refreshDisplayWithDelay } from '../../utils/setting-utils.js';

export class ColorpickerRenderer<T> extends AbstractPathRenderer<T> {
  // prettier-ignore
  protected createElement(
    setting: Setting,
    element: ColorPicker<T>
  ): PathRendererResult {

    const value = getValue(element) as string;;
    const colorValue = colord(value).toHex();

    let colorComponent!: ColorComponent;

    setting.addColorPicker((color) => {
      color
        .setValue(colorValue)
        .onChange(async (newValue) => {
          let _value: string | object = newValue;
          if (element.datatype) {
            if (element.datatype === 'RGB') {
              _value = rgbObject(newValue);
            } else if (element.datatype === 'string') {
              _value = colord(newValue).toRgbString();
            }
          }
          await setValue(element, _value);
          refreshDisplayWithDelay();
        });
      this._refreshPreview(setting, element);
      colorComponent = color;
    });
    const inputEl = setting.controlEl.firstChild as HTMLElement;
    inputEl.classList.add(css('colorpicker'));
    const result = { baseComponent: colorComponent, htmlElement: inputEl };

    return result;
  }

  private _refreshPreview(setting: Setting, element: ColorPicker<T>) {
    if (element.preview) {
      const el = setting.controlEl.createSpan({ cls: css('colorpicker-preview') });
      const template = document.createElement('template');
      template.innerHTML = element.preview().trim(); // parses HTML safely

      if (template.content.firstChild) {
        el.appendChild(template.content.firstChild);
      }
    }
  }
}
export function rgbObject(colorInput: string) {
  const { r, g, b } = colord(colorInput).toRgb();
  return { r, g, b };
}
