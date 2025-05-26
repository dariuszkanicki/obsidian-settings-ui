import type { ColorComponent, Setting } from 'obsidian';
import { getValue, setValue } from '../../utils/value-utils.js';
import { ColorDropdown } from '../types-api.js';
import { AbstractPathRenderer, PathRendererResult } from './abstract-path-renderer.js';
import { ContextService } from '../../utils/context-service.js';
import { translateDropdownItemLabel } from '../../utils/translation.js';
import { isCustomOptionChosen, setCustomOption } from '../../utils/storage.js';
import { rgbObject } from './colorpicker-renderer.js';
import { colord } from 'colord';
import { colorHEX } from '../../utils/colors.js';

export class ColorDropdownRenderer<T> extends AbstractPathRenderer<T> {
  colorPickerEl!: ColorComponent;

  protected createElement(setting: Setting, element: ColorDropdown<T>): PathRendererResult {
    let result!: PathRendererResult;
    const pathName: string = element.path!;

    const value = getValue(element);
    let color = colorHEX(this.container, value);

    if (isCustomOptionChosen(pathName)) {
      setting.addColorPicker((colorPickerEl) => {
        this.colorPickerEl = colorPickerEl;
        if (color) {
          colorPickerEl.setValue(color);
        }
        colorPickerEl.onChange(async (newValue) => {
          let _value: any = newValue;
          if (element.datatype) {
            if (element.datatype === 'RGB') {
              _value = rgbObject(newValue);
            } else if (element.datatype === 'string') {
              _value = colord(newValue).toRgbString();
            }
          }
          await setValue(element, _value);
          ContextService.refresh();
        });
      });

      setting.addText((txt) => {
        txt.setValue(value).onChange(async (newValue: any) => {
          if (color !== colorHEX(this.container, newValue)) {
            color = colorHEX(this.container, newValue);
            this.colorPickerEl.setValue(color);
            await setValue(element, newValue);
          }
        });
      });
    }

    setting.addDropdown((dropdown) => {
      if (element.withCustomOption) {
        element.items.push({ id: 'custom' });
      }

      element.items.forEach((item) => dropdown.addOption(item.id, translateDropdownItemLabel(element, item)));

      if (isCustomOptionChosen(pathName)) {
        dropdown.setValue('custom');
      } else {
        dropdown.setValue(value);
      }
      dropdown.onChange(async (newValue: any) => {
        if (newValue !== 'custom') {
          setCustomOption(pathName, false);
          await setValue(element, newValue);
        } else {
          setCustomOption(pathName, true);
        }
        ContextService.refresh();
      });
      result = { baseComponent: dropdown, htmlElement: dropdown.selectEl };
    });

    return result;
  }
}
