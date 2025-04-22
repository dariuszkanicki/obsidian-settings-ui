import { Setting } from 'obsidian';
import { BaseSetting, ConfigContext, PathSetting } from '../types';
import { saveMap } from '../../i18n/loader';
import { createSetting } from './setting-helper';

export abstract class AbstractBaseRenderer<T extends Record<string, any>> {
  constructor(protected context: ConfigContext<T>, private element: BaseSetting) {}

  // prettier-ignore
  render(
    container: HTMLElement, 
    groupMember: boolean
  ): void {
    const setting = createSetting(this.context, this.element, container, groupMember);
    this.createElement(this.context, setting, this.element);
  }
  protected abstract createElement(context: ConfigContext<T>, setting: Setting, element: BaseSetting): void;
}
