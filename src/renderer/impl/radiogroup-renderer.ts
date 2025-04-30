import type { ToggleComponent } from "obsidian";
import { Html, Tag } from "../../utils/html.js";
import { Toggle, RadioGroup } from "../types.js";
import { AbstractGroupRenderer } from "./abstract-group-renderer.js";
import { getLabel } from "./setting-helper.js";
import { ToggleRenderer } from "./toggle-renderer.js";

export class RadioGroupRenderer<T> extends AbstractGroupRenderer<T> {
  private itemsMap = new Map<
    string,
    { toggle: Toggle<T>; toggleComponent: ToggleComponent }
  >();
  private defaultToggleComponent?: ToggleComponent;

  protected createElement(container: HTMLElement, element: RadioGroup<T>) {
    const html = new Html(container);
    // prettier-ignore
    html.createDIV('group')
      .createDIV('group-header')
      // .createSPAN('group-toggle', '▼', Tag.close)
      .createDIV('group-title', getLabel(element), Tag.close)
      .closeTag()
      .createDIV('group-body');

    html.getElement("group")?.addClass("radio");
    const bodyEl = html.getElement("group-body")!;

    let valueSet = false;

    element.items.forEach((item, index) => {
      item.radioCallback = (path: string, value: boolean) => {
        if (value === false) {
          let valueSet = false;
          this.itemsMap.forEach((mapped) => {
            valueSet = valueSet || mapped.toggleComponent.getValue();
          });
          if (!valueSet && this.defaultToggleComponent) {
            this.defaultToggleComponent.setValue(true);
          }
        } else {
          this.itemsMap.forEach((mapped) => {
            if (mapped.toggle.path !== path) {
              mapped.toggleComponent.setValue(false);
            }
          });
        }
      };
      const renderer = new ToggleRenderer(item);
      const toggleComponent = renderer.render(bodyEl, true)
        .baseComponent as ToggleComponent;

      if (
        element.defaultIndex !== undefined &&
        index === element.defaultIndex
      ) {
        this.defaultToggleComponent = toggleComponent;
      }
      if (toggleComponent.getValue() === true) {
        valueSet = true;
      }
      this.itemsMap.set(item.path, {
        toggle: item,
        toggleComponent: toggleComponent,
      });
    });
    if (!valueSet && this.defaultToggleComponent) {
      this.defaultToggleComponent.setValue(true);
    }
  }
}
