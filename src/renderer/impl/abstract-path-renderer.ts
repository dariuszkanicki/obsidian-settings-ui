import type { BaseComponent, Setting } from 'obsidian';
import { css, defaultBar, tooltip, hint } from '../../utils/helper.js';
import { getSettingFontSize } from '../../utils/storage.js';
import { PathSetting } from '../types.js';
import { createSetting } from './setting-helper.js';

export type PathRendererResult = {
  baseComponent: BaseComponent;
  htmlElement: HTMLElement;
  noDefaultValueBar?: boolean;
};

export abstract class AbstractPathRenderer<T> {
  setting!: Setting;
  hintElement?: HTMLElement;
  protected container!: HTMLElement;

  constructor(private element: PathSetting<T>) {}

  render(containerEl: HTMLElement, groupMember: boolean) {
    this.container = containerEl;
    this.setting = createSetting(this.element, containerEl, groupMember);
    const created = this.createElement(this.setting, this.element);
    created.htmlElement.classList.add(css('item'));
    defaultBar(created.noDefaultValueBar, this.setting, this.element);
    tooltip(this.setting, this.element, this.tooltipAddition(this.element));
    let small = hint(this.setting, this.element);
    // if (this.element.validate) {
    //   const value = getValue(this.element);
    //   const { valid, data, invalid, preview } = this.element.validate(value);
    //   if (preview) {
    // small = previewAsHint(this.setting, preview);
    //   }
    // }
    this._scaleFont(created.htmlElement, small);
    return created;
  }

  protected tooltipAddition(element: PathSetting<T>) {
    return '';
  }

  protected abstract createElement(setting: Setting, element: PathSetting<T>): PathRendererResult;

  private _scaleFont(htmlElement: HTMLElement, hintElement?: HTMLElement) {
    const fontSize = getSettingFontSize();
    if (fontSize) {
      const scale = fontSize / 14;
      if (this.element.type === 'Toggle') {
        const margin = (1 - scale) * -20;
        htmlElement.setAttr('style', `transform: scale(${scale}); margin-left: ${margin}px`);
      } else {
        htmlElement.setAttr('style', `font-size: ${fontSize}px`);
      }
      if (hintElement) {
        let smallSize = 0.9 * fontSize;
        if (smallSize < 8) {
          smallSize = 8;
        }
        hintElement.setAttr('style', `font-size: ${smallSize}px`);
      }
    }
  }
}
