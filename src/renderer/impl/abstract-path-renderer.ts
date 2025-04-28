import type { BaseComponent, Setting } from 'obsidian';
import type { PathSetting } from '../types';
import { css, defaultButton, hint, tooltip } from '../../utils/helper';
import { getValue } from '../../utils/value-utils';
import { createSetting } from './setting-helper';
import { getSettingFontSize } from '../../utils/storage';

export type PathRendererResult = {
  baseComponent: BaseComponent;
  htmlElement: HTMLElement;
  noHint?: boolean;
};

export abstract class AbstractPathRenderer<T> {
  constructor(private element: PathSetting<T>) {}

  render(container: HTMLElement, groupMember: boolean) {
    const setting = createSetting(this.element, container, groupMember);
    const created = this.createElement(setting, this.element);

    created.htmlElement.classList.add(css('item'));
    this._initValue(created.baseComponent);
    defaultButton(setting, this.element);
    tooltip(setting, this.element);
    const hintElement = hint(created.noHint, setting, this.element);
    this._scaleFont(created.htmlElement, hintElement);

    return created;
  }

  protected abstract createElement(setting: Setting, element: PathSetting<T>): PathRendererResult;

  private _initValue(baseComponent: BaseComponent) {
    if ('setValue' in baseComponent && typeof baseComponent.setValue === 'function') {
      const value = getValue(this.element);
      // if placeholder is set, don't set the value if it's equals placeholder, so the placeholder is displayed as such
      if (this.element.placeholder === undefined || this.element.placeholder !== value) {
        let _value: any;
        if (typeof value === 'number') {
          _value = String(value);
        } else if (this.element.type === 'Toggle') {
          _value = value === undefined ? false : value;
        } else {
          _value = value;
        }
        (baseComponent as any).setValue(_value);
      }
    }
  }

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
