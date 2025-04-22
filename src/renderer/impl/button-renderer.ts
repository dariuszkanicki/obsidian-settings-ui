import { Setting } from 'obsidian';
import { AbstractBaseRenderer } from './abstract-base-renderer';
import { Button, ConfigContext } from '../types';
import { getTranslation } from './setting-helper';

export class ButtonRenderer<T extends Record<string, any>> extends AbstractBaseRenderer<T> {
  // prettier-ignore
  protected createElement(
    context: ConfigContext<T>, 
    setting: Setting, 
    element: Button
  ) {
    const _buttonText = () => {
      const translation = getTranslation(this.context, element);
      if (translation && translation.buttonText) {
        return translation.buttonText;
      } else {
        return element.buttonText;
      }
    }

    setting.addButton((button) => {
      button.setButtonText(_buttonText());
      button.onClick(() => element.onClick());
    });

  }
}
