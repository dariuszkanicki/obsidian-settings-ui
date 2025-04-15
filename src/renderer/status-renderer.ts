import { Context, Status, StatusField } from "..";
import { AbstractElement } from "./abstract-renderer";

export class StatusRenderer<T extends Record<string, any>> extends AbstractElement<T> {
    constructor(
      context: Context<T>,
      groupMember: boolean,
      protected element: Status<T>,
    ) {
      super(context, element.label, groupMember);
    }
    renderClassSpecific(): void {
        const wrapper = document.createElement('div');
        wrapper.className = this.helper.css('dkani-ui-status-wrapper');
        this.setting.controlEl.appendChild(wrapper);

        for (const item of this.element.items) {
          const pill = document.createElement('div');
          pill.className = this.helper.css('dkani-ui-status-pill');
          if (item.isEnabled !== undefined) pill.addClass(item.isEnabled ? 'enabled' : 'disabled');
          if (item.customClass) pill.addClass(item.customClass());
          pill.innerText = item.text;
          wrapper.appendChild(pill);
        }
    }
}