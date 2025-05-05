import type { Setting, ToggleComponent } from "obsidian";
import { css } from "../../utils/helper.js";
import { getValue, setValue } from "../../utils/value-utils.js";
import { RadioItem, Toggle } from "../types.js";
import { AbstractPathRenderer, PathRendererResult } from "./abstract-path-renderer.js";
import { AbstractBaseRenderer } from "./abstract-base-renderer.js";

export class RadioItemRenderer<T> extends AbstractBaseRenderer<T> {
  private toggle!: ToggleComponent;
  private callback!: (path: string, value: boolean) => void;
  private ignoreOnChange: boolean = false;

  protected createElement(
    setting: Setting,
    element: RadioItem,
  ) {
    let result!: PathRendererResult;
    setting.infoEl.addClass(css("info-toggle"));
    setting.addToggle((toggle) => {
      this.toggle = toggle;

      // toggle.setValue(getValue(element));
      toggle.onChange(async (value: any) => {
        if (this.ignoreOnChange === true) {
          this.ignoreOnChange = false;
        } else {
          toggle.setValue(value);
          this.callback(element.id, value);
        }
      });
    });
  }

  setGroupCallback(callback: (path: string, value: boolean) => void) {
    this.callback = callback;
  }
  setInternalValue(value: boolean) {
    this.ignoreOnChange = true;
    this.toggle.setValue(value);
  }
}
