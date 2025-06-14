import type { Setting } from 'obsidian';
import { getValue, setValue } from '../../utils/value-utils.js';
import type { Password } from '../types-api.js';
import type { PathRendererResult } from './abstract-path-renderer.js';
import { AbstractPathRenderer } from './abstract-path-renderer.js';
import { rearrangeInput } from '../../utils/helper.js';
import { createElement, Eye, EyeOff } from 'lucide';

export class PasswordRenderer<T> extends AbstractPathRenderer<T> {
  protected createElement(setting: Setting, element: Password<T>): PathRendererResult {
    let result!: PathRendererResult;
    let visible = false;
    setting.addText((txt) => {
      txt.setValue(getValue(element) as string).onChange(async (value: string) => {
        await setValue(element, value);
      });
      if (element.placeholder !== undefined) {
        txt.setPlaceholder(String(element.placeholder));
      }
      txt.inputEl.type = 'password';
      txt.inputEl.autocapitalize = 'off';
      txt.inputEl.autocomplete = 'off';
      txt.inputEl.spellcheck = false;

      // new ButtonComponent(setting.controlEl)
      //   .setButtonText('👁️')
      //   .setClass('password-toggle-button')
      //   .onClick(() => {
      //     visible = !visible;
      //     txt.inputEl.type = visible ? 'text' : 'password';
      //   })
      //   .setTooltip('Toggle password visibility');

      // Create icon container
      const iconContainer = setting.controlEl.createEl('a', {
        cls: 'password-icon-toggle',
        attr: { 'aria-label': 'Toggle password visibility', href: '#' },
      });

      const eyeIcon = createElement(Eye);
      iconContainer.appendChild(eyeIcon);

      iconContainer.addEventListener('click', (e) => {
        e.preventDefault();
        visible = !visible;
        txt.inputEl.type = visible ? 'text' : 'password';

        // Swap icon
        iconContainer.empty();
        const icon = visible ? createElement(EyeOff) : createElement(Eye);
        iconContainer.appendChild(icon);
      });

      rearrangeInput(setting);
      result = { baseComponent: txt, htmlElement: txt.inputEl, noDefaultValueBar: false };
    });
    return result;
  }
}
