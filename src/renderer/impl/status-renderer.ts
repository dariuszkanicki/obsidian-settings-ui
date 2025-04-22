import { Setting } from 'obsidian';
import { ConfigContext, Status } from '../types';
import { css } from '../../utils/helper';
import { AbstractBaseRenderer } from './abstract-base-renderer';
import { getLocalStorage } from '../../i18n/loader';

export class StatusRenderer<T extends Record<string, any>> extends AbstractBaseRenderer<T> {
  // prettier-ignore
  protected createElement(
    context: ConfigContext<T>, 
    setting: Setting, 
    element: Status
  ) {
    const wrapper = document.createElement('div');
    wrapper.className = css(context.pluginId, 'dkani-ui-status-wrapper');
    setting.controlEl.appendChild(wrapper);

    for (const item of element.items) {
      const pill = document.createElement('div');
      pill.className = css(context.pluginId, 'dkani-ui-status-pill');
      if (item.isEnabled !== undefined) pill.addClass(item.isEnabled ? 'enabled' : 'disabled');
      if (item.customClass) pill.addClass(item.customClass());
      pill.innerText = item.text;
      wrapper.appendChild(pill);
    }

    const fontSize = getLocalStorage(context.plugin, 'settings-font-size');
    if (fontSize) {
      wrapper.style.cssText = `font-size: ${fontSize}px`;
    }
  }
}
