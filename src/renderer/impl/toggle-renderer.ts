import { Setting } from 'obsidian';
import { css } from '../../utils/helper';
import { AbstractPathRenderer, PathRendererResult } from './abstract-path-renderer';
import { Toggle } from '../types';

export class ToggleRenderer<T extends Record<string, any>> extends AbstractPathRenderer<T> {
  // prettier-ignore
  protected createElement(
    pluginId: string, 
    setting: Setting, 
    element: Toggle<T>
  ): PathRendererResult {

    let result!: PathRendererResult;

    setting.infoEl.addClass(css(pluginId,'dkani-ui-info-toggle'));
    setting.addToggle((toggle) => {
      result = { baseComponent: toggle, htmlElement: toggle.toggleEl }
    });
    // transform: scale(1.5);
    return result;
  }
}
