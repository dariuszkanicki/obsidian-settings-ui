import type { ToggleComponent } from "obsidian";
import { Html, Tag } from "../../utils/html.js";
import { Toggle, RadioGroup } from "../types.js";
import { getLabel } from "./setting-helper.js";
import { ToggleRenderer } from "./toggle-renderer.js";
import { getValue, setValue } from "../../utils/value-utils.js";
import { RadioItemRenderer } from "./radioitem-renderer.js";

export class RadioGroupRenderer<T> {
  private itemsMap = new Map<string, { toggle: Toggle<T>; toggleComponent: ToggleComponent }>();
  private defaultToggleComponent?: ToggleComponent;

  constructor(private element: RadioGroup<T>) { }

  render(container: HTMLElement, groupMember: boolean): void {

    const html = new Html(container);
    // prettier-ignore
    html.createDIV('group')
      .createDIV('group-header')
      .createDIV('group-title', getLabel(this.element), Tag.close)
      .closeTag()
      .createDIV('group-body');

    html.getElement("group")?.addClass("radio");
    const bodyEl = html.getElement("group-body")!;

    let valueSet = false;
    console.log("group", this.element, getValue(this.element));

    this.element.items.forEach((item, index) => {
      console.log("item", item);
      const renderer = new RadioItemRenderer(item);
      renderer.render(bodyEl, true)

      renderer.setGroupCallback((path: string, value: boolean) => {
        console.log("group.callback", path, value);
        if (value === true) {
          setValue(this.element, path);
        } else {
          if (this.element.defaultId) {
            setValue(this.element, this.element.defaultId);
          } else {
            setValue(this.element, '');
          }
        }
      });

      if (item.id === getValue(this.element)) {
        renderer.setInternalValue(true);
      }
    });
  }
}
