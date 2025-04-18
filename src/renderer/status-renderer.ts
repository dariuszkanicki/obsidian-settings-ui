import { Setting } from 'obsidian';
import { Status } from '..';
import { AbstractRenderer, IAbstractRendererResult } from './abstract-renderer';
import { css } from '../utils/helper';

export class StatusRenderer<T extends Record<string, any>> extends AbstractRenderer<T> {
  // prettier-ignore
  protected createElement(
    pluginId: string, 
    setting: Setting, 
    element: Status<T>
  ): IAbstractRendererResult {

    const wrapper = document.createElement('div');
    wrapper.className = css(pluginId, 'dkani-ui-status-wrapper');
    setting.controlEl.appendChild(wrapper);

    let renderer: IAbstractRendererResult;

    for (const item of element.items) {
      const pill = document.createElement('div');
      pill.className = css(pluginId, 'dkani-ui-status-pill');
      if (item.isEnabled !== undefined) pill.addClass(item.isEnabled ? 'enabled' : 'disabled');
      if (item.customClass) pill.addClass(item.customClass());
      pill.innerText = item.text;
      wrapper.appendChild(pill);
      renderer = { baseComponent: undefined, htmlElement: wrapper }
    }
    return renderer;
  }
}
