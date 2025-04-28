import type { Setting, ToggleComponent } from "obsidian";
import { css } from "../../utils/helper";
import type { PathRendererResult } from "./abstract-path-renderer";
import { AbstractPathRenderer } from "./abstract-path-renderer";
import type { Toggle } from "../types";
import { setValue } from "../../utils/value-utils";

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
      toggle.onChange(async (value: any) => {
        await setValue(element, value);
        const radioCb = element.radioCallback;
        if (radioCb !== undefined) {
          radioCb(element.path, value);
        }
      });
      result = { baseComponent: toggle, htmlElement: toggle.toggleEl };
    });
    // transform: scale(1.5);
    return result;
  }
}
