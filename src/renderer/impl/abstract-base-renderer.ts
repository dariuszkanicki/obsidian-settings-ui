import type { Setting } from "obsidian";
import { BaseSetting } from "../types.js";
import { createSetting } from "./setting-helper.js";

export abstract class AbstractBaseRenderer<T> {
  constructor(private element: BaseSetting) { }

  render(container: HTMLElement, groupMember: boolean): void {
    const setting = createSetting(this.element, container, groupMember);
    this.createElement(setting, this.element);
  }

  protected abstract createElement(
    setting: Setting,
    element: BaseSetting,
  ): void;
}
