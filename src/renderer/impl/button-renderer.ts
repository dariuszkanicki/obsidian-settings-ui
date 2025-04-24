import { Setting } from 'obsidian';
import { AbstractBaseRenderer } from './abstract-base-renderer';
import { Button } from '../types';
import { getTranslation } from '../../utils/helper';

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
