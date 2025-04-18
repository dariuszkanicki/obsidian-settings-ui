import { DropdownComponent, Setting } from 'obsidian';
import { Dropdown } from '..';
import { AbstractPathRenderer } from './abstract-path-renderer';
import { IAbstractRendererResult } from './abstract-renderer';

export class DropdownRenderer<T extends Record<string, any>> extends AbstractPathRenderer<T> {
  // prettier-ignore
  protected createElement(
    pluginId: string, 
    setting: Setting, 
    element: Dropdown<T>
  ): IAbstractRendererResult {

    let valueComponent!: DropdownComponent;
    let htmlComponent!: HTMLElement;

    let renderer: IAbstractRendererResult;

    setting.addDropdown((dropdown) => {
      element.items.forEach((item) => {
        dropdown.addOption(item.value, item.display);
      });
      renderer = { baseComponent: dropdown, htmlElement: dropdown.selectEl }
    });

    return renderer;
  }
}
