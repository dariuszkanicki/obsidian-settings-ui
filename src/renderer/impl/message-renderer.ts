import { localizedSetting4Text } from '../../utils/translation.js';
import type { Message } from '../types-api.js';
import { AbstractRenderer } from './abstract-renderer.js';

export class MessageRenderer extends AbstractRenderer {
  protected createElement(container: HTMLElement, element: Message): void {
    if (element.showIf === false) return;
    const localized = localizedSetting4Text(element.id);
    const message = localized ? localized.text : element.message;
    container.createEl('p', { text: message });
    container.createEl('br');
  }
}
