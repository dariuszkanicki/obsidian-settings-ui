import { DropdownComponent, Setting } from 'obsidian';
import { AbstractPathRenderer, PathRendererResult } from '../abstract-path-renderer';
import { Dropdown } from '../types';

export class DropdownRenderer<T extends Record<string, any>> extends AbstractPathRenderer<T> {
  // prettier-ignore
  protected createElement(
    pluginId: string, 
    setting: Setting, 
    element: Dropdown<T>
  ): PathRendererResult {

    let result: PathRendererResult;

    setting.addDropdown((dropdown) => {
      element.items.forEach((item) => {
        dropdown.addOption(item.value, item.display);
      });
      result = { baseComponent: dropdown, htmlElement: dropdown.selectEl }
    });

    return result;
  }
}
