import type { Setting } from 'obsidian';
import { BaseSetting } from '../types.js';
import { Button } from '../types-api.js';
import { AbstractBaseRenderer } from './abstract-base-renderer.js';
import { translateButtonText } from '../../utils/translation.js';

export class ButtonRenderer<T> extends AbstractBaseRenderer<T> {
  constructor(element: BaseSetting) {
    super(element, true);
  }

  protected createElement(setting: Setting, element: Button) {
    setting.addButton((button) => {
      button.setButtonText(translateButtonText(element));
      button.onClick(() => element.onClick());
      button.setCta();
    });
  }
}
