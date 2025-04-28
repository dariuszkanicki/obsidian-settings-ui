import type { Setting } from "obsidian";
import type { PathRendererResult } from "./abstract-path-renderer";
import { AbstractPathRenderer } from "./abstract-path-renderer";
import type { Dropdown } from "../types";
import { setValue } from "../../utils/value-utils";

export class DropdownRenderer<T> extends AbstractPathRenderer<T> {
  protected createElement(
    setting: Setting,
    element: Dropdown<T>,
  ): PathRendererResult {
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
