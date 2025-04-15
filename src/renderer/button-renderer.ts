import { Button, Context, StatusField } from '..';
import { AbstractElement } from './abstract-renderer';

export class ButtonRenderer<T extends Record<string, any>> extends AbstractElement<T> {
  constructor(context: Context<T>, groupMember: boolean, protected element: Button<T>) {
    super(context, undefined, groupMember);
  }
  renderClassSpecific(): void {
    this.setting.addButton((button) => {
      button.setButtonText(this.element.label);
      button.onClick(() => this.element.onClick());
    });

    const wrapper = document.createElement('div');
    wrapper.className = this.helper.css('dkani-ui-status-wrapper');
    this.setting.controlEl.appendChild(wrapper);
  }
}
