import type { ToggleComponent } from 'obsidian';
import { Html, Tag } from '../../utils/html.js';
import { RadioGroup } from '../types-api.js';
import { Toggle } from '../types-api.js';
import { label } from './setting-helper.js';
import { ToggleRenderer } from './toggle-renderer.js';
import { getValue, setValue } from '../../utils/value-utils.js';
import { RadioItemRenderer } from './radioitem-renderer.js';
import { ContextService } from '../../utils/context-service.js';

export class RadioGroupRenderer<T> {
  private itemsMap = new Map<string, { toggle: Toggle<T>; toggleComponent: ToggleComponent }>();
  private defaultToggleComponent?: ToggleComponent;

  constructor(private element: RadioGroup<T>) {}

  render(container: HTMLElement, groupMember: boolean): void {
    const html = new Html(container);
    // prettier-ignore
    html.createDIV('group')
      .createDIV('group-header')
      .createDIV('group-title', '', Tag.close)
      .closeTag()
      .createDIV('group-body');

    label(this.element, html.getElement('group-title')!);

    html.getElement('group')?.addClass('radio');
    const bodyEl = html.getElement('group-body')!;

    let valueSet = false;

    this.element.items.forEach((item, index) => {
      const renderer = new RadioItemRenderer(this.element, item);
      renderer.render(bodyEl, true);

      renderer.setGroupCallback((path: string, value: boolean) => {
        if (value === true) {
          setValue(this.element, path);
        } else {
          if (this.element.defaultId) {
            setValue(this.element, this.element.defaultId);
          } else {
            setValue(this.element, '');
          }
        }
        ContextService.refresh();
      });

      if (item.id === getValue(this.element)) {
        renderer.setInternalValue(true);
      }
    });
  }
}
