import type { Setting } from 'obsidian';
import { getValue, setValue } from '../../utils/value-utils.js';
import { Dropdown } from '../types.js';
import { AbstractPathRenderer, PathRendererResult } from './abstract-path-renderer.js';
import { ContextService } from '../../utils/context-service.js';
import { translateDropdownItem, translateDropdownItemById } from '../../utils/translation.js';

export class DropdownRenderer<T> extends AbstractPathRenderer<T> {
  protected createElement(setting: Setting, element: Dropdown<T>): PathRendererResult {
    let result!: PathRendererResult;

    setting.addDropdown((dropdown) => {
      element.items.forEach((item) => {
        let label;
        if (typeof item === 'string') {
          let label = translateDropdownItemById(element, item) ?? item;
          dropdown.addOption(item, label);
        } else {
          let label = translateDropdownItem(element, item, item.label) ?? item.id;
          dropdown.addOption(item.id, label);
        }
      });
      dropdown.setValue(getValue(element));
      dropdown.onChange(async (value: any) => {
        await setValue(element, value);
        ContextService.refresh();
      });
      result = { baseComponent: dropdown, htmlElement: dropdown.selectEl };
    });

    return result;
  }
}
