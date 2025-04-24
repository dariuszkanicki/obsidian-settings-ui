import { Setting } from 'obsidian';
import { AbstractPathRenderer, PathRendererResult } from './abstract-path-renderer';
import { Dropdown } from '../types';
import { setValue } from '../../utils/value-utils';

export class DropdownRenderer<T> extends AbstractPathRenderer<T> {
  protected createElement(setting: Setting, element: Dropdown<T>): PathRendererResult {
    let result!: PathRendererResult;

    setting.addDropdown((dropdown) => {
      element.items.forEach((item) => {
        dropdown.addOption(item.value, item.display);
        dropdown.onChange(async (value: any) => {
          await setValue(element, value);
        });
      });
      result = { baseComponent: dropdown, htmlElement: dropdown.selectEl };
    });

    return result;
  }
}
