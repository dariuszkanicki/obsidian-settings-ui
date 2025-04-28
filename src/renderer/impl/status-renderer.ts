import type { Setting } from "obsidian";
import type { Status } from "../types";
import { css } from "../../utils/helper";
import { AbstractBaseRenderer } from "./abstract-base-renderer";
import { getSettingFontSize } from "../../utils/storage";

export class StatusRenderer<T> extends AbstractBaseRenderer<T> {
  protected createElement(setting: Setting, element: Status) {
    const wrapper = document.createElement("div");
    wrapper.className = css("status-wrapper");
    setting.controlEl.appendChild(wrapper);

    for (const item of element.items) {
      const pill = document.createElement("div");
      pill.className = css("status-pill");
      if (item.isEnabled !== undefined)
        pill.addClass(item.isEnabled ? "enabled" : "disabled");
      if (item.customClass) pill.addClass(item.customClass());
      pill.innerText = item.text;
      wrapper.appendChild(pill);
    }

    const fontSize = getSettingFontSize();
    if (fontSize) {
      wrapper.style.cssText = `font-size: ${fontSize}px`;
    }
  }
}
