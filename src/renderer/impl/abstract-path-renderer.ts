import type { BaseComponent, Setting } from 'obsidian';
import { css, defaultBar } from '../../utils/helper.js';
import { hint } from '../../utils/hint.js';
import { getSettingFontSize } from '../../utils/storage.js';
import type { PathSetting } from '../types.js';
import { createSetting } from './setting-helper.js';
import { tooltip } from '../../utils/tooltip-helper.js';

export type PathRendererResult = {
  baseComponent: BaseComponent;
  htmlElement: HTMLElement;
  noDefaultValueBar?: boolean;
};

export abstract class AbstractPathRenderer<T> {
  setting!: Setting;
  hintElement?: HTMLElement;
  errorElement?: HTMLElement;

  protected container!: HTMLElement;
  private defaultBarSpan?: HTMLSpanElement;

  constructor(private element: PathSetting<T>) {}

  render(containerEl: HTMLElement, groupMember: boolean) {
    this.container = containerEl;
    const element = this.element;
    // const labelElement = {
    //   id: (element.path as any) | (element.id as any),
    //   label: (this.element as PathSettingWithHandlerAndLabel<T>).label ? '' : '',
    //   replacements: this.element.replacements,
    // };
    // console.log('labelElement', labelElement);

    this.setting = createSetting(element, containerEl, groupMember);
    const created = this.createElement(this.setting, this.element);
    created.htmlElement.classList.add(css('item'));
    this.defaultBarSpan = defaultBar(created.noDefaultValueBar, this.setting, this.element);
    tooltip(this.setting, this.element, this.tooltipAddition(this.element));
    this.hintElement = hint(this.setting, this.element);
    // if (this.element.validate) {
    //   const value = getValue(this.element);
    //   const { valid, data, invalid, preview } = this.element.validate(value);
    //   if (preview) {
    // small = previewAsHint(this.setting, preview);
    //   }
    // }
    this._scaleFont(created.htmlElement, this.hintElement);
    return created;
  }

  protected tooltipAddition(_element: PathSetting<T>) {
    return '';
  }

  protected displayDefaultBar(display: boolean) {
    if (this.defaultBarSpan) {
      if (display) {
        this.defaultBarSpan.style.cssText = 'display: block';
      } else {
        this.defaultBarSpan.style.cssText = 'display: none';
      }
    }
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
