import type { Setting } from 'obsidian';
import { BaseSetting } from '../types.js';
import { createSetting } from './setting-helper.js';

export abstract class AbstractBaseRenderer<T> {
  // protected withoutLabel = false;
  constructor(
    private element: BaseSetting,
    private withoutLabel = false,
  ) {}

  render(container: HTMLElement, groupMember: boolean): void {
    const setting = createSetting(this.element, container, groupMember, this.withoutLabel);
    this.createElement(setting, this.element);
  }

  protected abstract createElement(setting: Setting, element: BaseSetting): void;
}
