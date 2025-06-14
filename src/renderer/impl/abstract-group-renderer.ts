import type { GroupSetting } from '../types-api.js';

export abstract class AbstractGroupRenderer<T> {
  constructor(private element: GroupSetting<T>) {}

  render(container: HTMLElement, _groupMember: boolean): void {
    this.createElement(container, this.element);
  }
  protected abstract createElement(container: HTMLElement, element: GroupSetting<T>): void;
}
