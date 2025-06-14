import { css } from '../../utils/helper.js';
import type { HowToSection } from '../types-api.js';

export function renderHowToSection(bodyEl: HTMLElement, pluginId: string, howTo: HowToSection) {
  const { description, readmeURL, classes = {} } = howTo;
  const desc = bodyEl.createEl('small', {
    text: description,
    cls: classes.description ?? css('howto-text'),
  });

  if (readmeURL) {
    desc.createEl('br');
    desc.createEl('br');
    desc.createEl('span', { text: 'See the ' });
    desc.createEl('a', {
      href: readmeURL,
      text: 'README',
      title: readmeURL,
    });
    desc.createEl('span', {
      text: ' for more information and troubleshooting.',
    });
  }
}
