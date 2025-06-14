import type { Setting, ToggleComponent } from 'obsidian';
import { css } from '../../utils/helper.js';
import type { BaseSetting } from '../types.js';
import type { RadioGroup } from '../types-api.js';
import type { RadioItem } from '../types-api.js';
import { AbstractBaseRenderer } from './abstract-base-renderer.js';
import { tooltip4Radioitem } from '../../utils/tooltip-helper.js';

export class RadioItemRenderer<T> extends AbstractBaseRenderer {
  private toggle!: ToggleComponent;
  private callback!: (path: string, value: boolean) => void;
  private ignoreOnChange: boolean = false;

  constructor(
    private parent: RadioGroup<T>,
    element: BaseSetting,
  ) {
    super(element);
  }

  protected createElement(setting: Setting, element: RadioItem) {
    setting.infoEl.addClass(css('info-toggle'));
    setting.addToggle((toggle) => {
      this.toggle = toggle;

      // toggle.setValue(getValue(element));
      toggle.onChange((value: boolean) => {
        if (this.ignoreOnChange === true) {
          this.ignoreOnChange = false;
        } else {
          toggle.setValue(value);
          this.callback(element.id, value);
        }
      });
    });
    tooltip4Radioitem(setting, element, this.parent);
  }

  setGroupCallback(callback: (path: string, value: boolean) => void) {
    this.callback = callback;
  }
  setInternalValue(value: boolean) {
    this.ignoreOnChange = true;
    this.toggle.setValue(value);
  }
}
