import type { ToggleComponent } from 'obsidian';
import { Html, Tag } from '../../utils/html.js';
import type { RadioGroup } from '../types-api.js';
import type { Toggle } from '../types-api.js';
import { label } from './setting-helper.js';
import { getValue, setValue } from '../../utils/value-utils.js';
import { RadioItemRenderer } from './radioitem-renderer.js';
import { ContextService } from '../../utils/context-service.js';
import { refreshDisplayWithDelay } from '../../utils/setting-utils.js';

export class RadioGroupRenderer<T> {
  private itemsMap = new Map<string, { toggle: Toggle<T>; toggleComponent: ToggleComponent }>();
  private defaultToggleComponent?: ToggleComponent;

  constructor(private element: RadioGroup<T>) {}

  render(container: HTMLElement, _groupMember: boolean): void {
    const html = new Html(container);
    // prettier-ignore
    html.createDIV('group')
      .createDIV('group-header')
      .createDIV('group-title', '', Tag.close)
      .closeTag()
      .createDIV('group-body');

    const labelElement = { id: this.element.path, label: this.element.label };
    label(labelElement, html.getElement('group-title')!);

    html.getElement('group')?.addClass('radio');
    const bodyEl = html.getElement('group-body')!;

    this.element.items.forEach((item) => {
      const renderer = new RadioItemRenderer(this.element, item);
      renderer.render(bodyEl, true);

      renderer.setGroupCallback((path: string, value: boolean) => {
        void (async () => {
          if (value === true) {
            await setValue(this.element, path);
          } else {
            if (this.element.defaultId) {
              await setValue(this.element, this.element.defaultId);
            } else {
              await setValue(this.element, '');
            }
          }
          refreshDisplayWithDelay();
        })();
      });

      if (item.id === getValue(this.element)) {
        renderer.setInternalValue(true);
      }
    });
  }
}
