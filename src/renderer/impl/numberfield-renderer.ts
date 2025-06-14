import type { Setting } from 'obsidian';
import { css } from '../../utils/helper.js';
import { getDefaultValue, getValue, setValue } from '../../utils/value-utils.js';
import type { Numberfield } from '../types-api.js';
import type { PathRendererResult } from './abstract-path-renderer.js';
import { AbstractPathRenderer } from './abstract-path-renderer.js';
import { ContextService } from '../../utils/context-service.js';
import { refreshDisplayWithDelay } from '../../utils/setting-utils.js';

export class NumberfieldRenderer<T> extends AbstractPathRenderer<T> {
  private refreshNecessary = false;
  protected createElement(setting: Setting, element: Numberfield<T>): PathRendererResult {
    let result!: PathRendererResult;

    setting.addText((txt) => {
      txt.setValue(String(getValue(element)));
      txt.inputEl.type = 'number';
      txt.inputEl.classList.add(css('item-short'));
      setting.controlEl.addClass('number');
      if (element.constraint && element.constraint.unit) {
        setting.controlEl.createEl('label', { text: `${element.constraint.unit}` });
      } else if (element.unit) {
        setting.controlEl.createEl('label', { text: `${element.unit}` });
      }
      if (element.placeholder !== undefined) {
        txt.setPlaceholder(String(element.placeholder));
      }

      txt.onChange(async (value) => {
        const defaultValue = getDefaultValue(element);
        const oldValue = getValue(element);
        let val = Number(value);
        if (!isNaN(val)) {
          if (value === '') {
            val = defaultValue;
          } else if (element.constraint) {
            const c = element.constraint;
            val = Math.max(c.min ?? -Infinity, Math.min(val, c.max ?? Infinity));
          }
          txt.setValue(String(val));
          await setValue(element, val);
          if ((oldValue !== defaultValue && val == defaultValue) || (oldValue === defaultValue && val !== defaultValue)) {
            this.refreshNecessary = true;
          }
        }
      });
      txt.inputEl.addEventListener('blur', () => {
        void (async () => {
          if (this.refreshNecessary) {
            refreshDisplayWithDelay();
          }
        })();
      });
      result = { baseComponent: txt, htmlElement: txt.inputEl };
    });
    return result;
  }
  protected tooltipAddition(element: Numberfield<T>) {
    if (element.constraint) {
      if (element.constraint.min !== undefined && element.constraint.max !== undefined) {
        return `<em>\nRange: ${element.constraint.min} - ${element.constraint.max}</em>`;
      } else if (element.constraint.min !== undefined) {
        return `<em>\nMinimum: ${element.constraint.min}</em>`;
      } else if (element.constraint.max !== undefined) {
        return `<em>\nMaximum: ${element.constraint.max}</em>`;
      }
    }
    return '';
  }
}
