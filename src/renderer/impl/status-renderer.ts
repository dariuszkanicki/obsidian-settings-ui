import { Setting } from 'obsidian';
import { Status } from '../types';
import { css } from '../../utils/helper';
import { AbstractBaseRenderer } from '../abstract-base-renderer';

export class StatusRenderer extends AbstractBaseRenderer {
  // prettier-ignore
  protected createElement(
    pluginId: string, 
    setting: Setting, 
    element: Status
  ) {
    const wrapper = document.createElement('div');
    wrapper.className = css(pluginId, 'dkani-ui-status-wrapper');
    setting.controlEl.appendChild(wrapper);

    for (const item of element.items) {
      const pill = document.createElement('div');
      pill.className = css(pluginId, 'dkani-ui-status-pill');
      if (item.isEnabled !== undefined) pill.addClass(item.isEnabled ? 'enabled' : 'disabled');
      if (item.customClass) pill.addClass(item.customClass());
      pill.innerText = item.text;
      wrapper.appendChild(pill);
    }
  }
}
