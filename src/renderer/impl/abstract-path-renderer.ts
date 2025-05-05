import type { BaseComponent, Setting } from 'obsidian';
import { css, defaultBar, tooltip, hint, previewAsHint } from '../../utils/helper.js';
import { getSettingFontSize } from '../../utils/storage.js';
import { PathSetting } from '../types.js';
import { createSetting } from './setting-helper.js';
import { getValue } from '../../utils/value-utils.js';

export type PathRendererResult = {
  baseComponent: BaseComponent;
  htmlElement: HTMLElement;
  noHint?: boolean;
  noDefaultValueBar?: boolean;
};

export abstract class AbstractPathRenderer<T> {

  setting!: Setting;
  hintElement?: HTMLElement;

  constructor(private element: PathSetting<T>) { }

  render(container: HTMLElement, groupMember: boolean) {
    this.setting = createSetting(this.element, container, groupMember);
    const created = this.createElement(this.setting, this.element);

    created.htmlElement.classList.add(css('item'));
    defaultBar(created.noDefaultValueBar, this.setting, this.element);
    tooltip(this.setting, this.element);
    let small = hint(created.noHint, this.setting, this.element);
    if (this.element.validate) {
      const value = getValue(this.element);
      const { valid, data, invalid, preview } = this.element.validate(value);
      console.log("element.validate", value, valid, data, preview);
      if (preview) {
        small = previewAsHint(this.setting, preview);
      }
    }
    this._scaleFont(created.htmlElement, small);

    return created;
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
