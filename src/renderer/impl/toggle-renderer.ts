import { Setting, ToggleComponent } from 'obsidian';
import { css } from '../../utils/helper';
import { AbstractPathRenderer, PathRendererResult } from './abstract-path-renderer';
import { ConfigContext, PathSetting, Toggle } from '../types';
import { setValue } from '../../utils/value-utils';

export class ToggleRenderer<T extends Record<string, any>> extends AbstractPathRenderer<T> {
  private toggleComponent?: ToggleComponent;
  // prettier-ignore
  protected createElement(
    pluginId: string, 
    setting: Setting, 
    element: Toggle<T>
  ): PathRendererResult {

    let result!: PathRendererResult;
    setting.infoEl.addClass(css(pluginId,'dkani-ui-info-toggle'));
    setting.addToggle((toggle) => {
      this.toggleComponent = toggle;
      result = { baseComponent: toggle, htmlElement: toggle.toggleEl }
    });
    // transform: scale(1.5);
    return result;
  }
  protected async onChange(context: ConfigContext<T>, element: Toggle<T>, value: boolean) {
    await super.onChange(context, element, value);
    const radioCb = element.radioCallback;
    if (radioCb !== undefined) {
      radioCb(element.path, value);
    }
  }
}
