import type { Setting } from 'obsidian';
import { getValue, setValue } from '../../utils/value-utils.js';
import type { Dropdown } from '../types-api.js';
import type { PathRendererResult } from './abstract-path-renderer.js';
import { AbstractPathRenderer } from './abstract-path-renderer.js';
import { ContextService } from '../../utils/context-service.js';
import { translateDropdownItemLabel, translateDropdownItemLabelById } from '../../utils/translation.js';
import { refreshDisplayWithDelay } from '../../utils/setting-utils.js';

export class DropdownRenderer<T> extends AbstractPathRenderer<T> {
  protected createElement(setting: Setting, element: Dropdown<T>): PathRendererResult {
    let result!: PathRendererResult;

    setting.addDropdown((dropdown) => {
      element.items.forEach((item) => {
        if (typeof item === 'string') {
          dropdown.addOption(item, translateDropdownItemLabelById(element, item));
        } else {
          dropdown.addOption(item.id, translateDropdownItemLabel(element, item));
        }
      });
      dropdown.setValue(getValue(element) as string);
      dropdown.onChange(async (value: string) => {
        await setValue(element, value);
        refreshDisplayWithDelay();
      });
      result = { baseComponent: dropdown, htmlElement: dropdown.selectEl };
    });

    return result;
  }
}
