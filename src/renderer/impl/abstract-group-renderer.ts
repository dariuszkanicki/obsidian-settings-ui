import { Setting } from 'obsidian';
import { BaseSetting, ConfigContext, GroupSetting, PathSetting } from '../types';
import { createSetting } from './setting-helper';

export abstract class AbstractGroupRenderer<T extends Record<string, any>> {
  constructor(protected context: ConfigContext<T>, private element: GroupSetting<T>) {}

  // prettier-ignore
  render(
    container: HTMLElement, 
    groupMember: boolean
  ): void {
    // const setting = createSetting(this.context, this.element, container, groupMember);
    this.createElement(this.context, container, this.element);
  }
  protected abstract createElement(context: ConfigContext<T>, container: HTMLElement, element: GroupSetting<T>): void;
}
