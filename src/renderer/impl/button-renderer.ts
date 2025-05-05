import type { Setting } from "obsidian";
import { Button } from "../types.js";
import { AbstractBaseRenderer } from "./abstract-base-renderer.js";
import { getTranslation } from "../../utils/translation.js";

export class ButtonRenderer<T> extends AbstractBaseRenderer<T> {
  protected createElement(setting: Setting, element: Button) {
    const _buttonText = () => {
      const translation = getTranslation(element);
      if (translation && translation.buttonText) {
        return translation.buttonText;
      } else {
        return element.buttonText;
      }
    };

    setting.addButton((button) => {
      button.setButtonText(_buttonText());
      button.onClick(() => element.onClick());
    });
  }
}
