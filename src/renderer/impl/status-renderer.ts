import type { Setting } from 'obsidian';
import { css } from '../../utils/helper.js';
import { getSettingFontSize } from '../../utils/storage.js';
import type { Status } from '../types-api.js';
import { AbstractBaseRenderer } from './abstract-base-renderer.js';

export class StatusRenderer extends AbstractBaseRenderer {
  protected createElement(setting: Setting, element: Status) {
    const wrapper = document.createElement('div');
    wrapper.className = css('status-wrapper');
    setting.controlEl.appendChild(wrapper);

    for (const item of element.items) {
      const pill = document.createElement('div');
      pill.className = css('status-pill');
      if (item.isEnabled !== undefined) pill.addClass(item.isEnabled ? 'enabled' : 'disabled');
      if (item.customClass) pill.addClass(item.customClass());
      pill.innerText = item.text;
      wrapper.appendChild(pill);
    }

    const fontSize = getSettingFontSize();
    if (fontSize) {
      wrapper.style.cssText = `font-size: ${fontSize}px`;
    }
  }
}
