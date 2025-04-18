import { Setting } from 'obsidian';
import { AbstractBaseRenderer } from '../abstract-base-renderer';
import { Button } from '../types';

export class ButtonRenderer extends AbstractBaseRenderer {
  // prettier-ignore
  protected createElement(
    pluginId: string, 
    setting: Setting, 
    element: Button
  ) {
    setting.addButton((button) => {
      button.setButtonText(element.label);
      button.onClick(() => element.onClick());
    });
  }
}
