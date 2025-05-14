import type { Setting } from 'obsidian';
import { BaseSetting, Button } from '../types.js';
import { AbstractBaseRenderer } from './abstract-base-renderer.js';
import { translateButtonText } from '../../utils/translation.js';

export class ButtonRenderer<T> extends AbstractBaseRenderer<T> {
  constructor(element: BaseSetting) {
    element.withoutLabel = true;
    super(element);
  }

  protected createElement(setting: Setting, element: Button) {
    setting.addButton((button) => {
      button.setButtonText(translateButtonText(element));
      button.onClick(() => element.onClick());
      button.setCta();
    });
  }
}
