import { Setting } from 'obsidian';
import { Button } from '..';
import { AbstractRenderer, IAbstractRendererResult } from './abstract-renderer';

export class ButtonRenderer<T extends Record<string, any>> extends AbstractRenderer<T> {
  // prettier-ignore
  protected createElement(
    pluginId: string, 
    setting: Setting, 
    element: Button<T>
  ): IAbstractRendererResult {

    let renderer: IAbstractRendererResult;
    
    setting.addButton((button) => {
      button.setButtonText(element.label);
      button.onClick(() => element.onClick());
      renderer = { baseComponent: button, htmlElement: button.buttonEl }
    });
    return renderer;
  }
}
