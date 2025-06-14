import type { Setting, ToggleComponent } from 'obsidian';
import { css } from '../../utils/helper.js';
import { getValue, setValue } from '../../utils/value-utils.js';
import type { Toggle } from '../types-api.js';
import type { PathRendererResult } from './abstract-path-renderer.js';
import { AbstractPathRenderer } from './abstract-path-renderer.js';
import { ContextService } from '../../utils/context-service.js';
import { refreshDisplayWithDelay } from '../../utils/setting-utils.js';

export class ToggleRenderer<T> extends AbstractPathRenderer<T> {
  private toggleComponent?: ToggleComponent;

  protected createElement(setting: Setting, element: Toggle<T>): PathRendererResult {
    let result!: PathRendererResult;
    setting.infoEl.addClass(css('info-toggle'));
    setting.addToggle((toggle) => {
      this.toggleComponent = toggle;

      toggle.setValue(getValue(element) as boolean);
      toggle.onChange(async (value: boolean) => {
        await setValue(element, value);
        refreshDisplayWithDelay();
      });
      result = { baseComponent: toggle, htmlElement: toggle.toggleEl, noDefaultValueBar: true };
    });
    // transform: scale(1.5);
    return result;
  }
}
