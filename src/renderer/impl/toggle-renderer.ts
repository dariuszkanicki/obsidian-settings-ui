import type { Setting, ToggleComponent } from "obsidian";
import { css } from "../../utils/helper.js";
import { getValue, setValue } from "../../utils/value-utils.js";
import { Toggle } from "../types.js";
import { AbstractPathRenderer, PathRendererResult } from "./abstract-path-renderer.js";

export class ToggleRenderer<T> extends AbstractPathRenderer<T> {
  private toggleComponent?: ToggleComponent;

  protected createElement(
    setting: Setting,
    element: Toggle<T>,
  ): PathRendererResult {
    let result!: PathRendererResult;
    setting.infoEl.addClass(css("info-toggle"));
    setting.addToggle((toggle) => {
      this.toggleComponent = toggle;

      toggle.setValue(getValue(element));
      toggle.onChange(async (value: any) => {
        await setValue(element, value);
      });
      result = { baseComponent: toggle, htmlElement: toggle.toggleEl, noDefaultValueBar: true };
    });
    // transform: scale(1.5);
    return result;
  }

  setInternalValue(toggle: ToggleComponent, value: boolean) {
    console.log("setInternalValue", value);
    toggle.setValue(value);
  }
}
