import type { Setting } from "obsidian";
import { getValue, setValue } from "../../utils/value-utils.js";
import { Dropdown } from "../types.js";
import { AbstractPathRenderer, PathRendererResult } from "./abstract-path-renderer.js";

export class DropdownRenderer<T> extends AbstractPathRenderer<T> {
  protected createElement(
    setting: Setting,
    element: Dropdown<T>,
  ): PathRendererResult {
    let result!: PathRendererResult;

    setting.addDropdown((dropdown) => {
      dropdown.setValue(getValue(element));
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
