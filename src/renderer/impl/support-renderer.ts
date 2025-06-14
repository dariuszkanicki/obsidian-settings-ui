import { Setting } from 'obsidian';
import { Html, Tag } from '../../utils/html.js';
import { translateElementPart } from '../../utils/translation.js';
import type { SupportSection } from '../types-api.js';

export function renderSupportSection(container: HTMLElement, support: SupportSection | undefined) {
  const groupTitle = translateElementPart({ id: 'supportGroup' }, 'label') ?? 'Support';

  const html = new Html(container);
  // prettier-ignore
  html.createDIV('group')
    .createDIV('group-header')
    .createDIV('group-title', groupTitle, Tag.close)
    .closeTag()
    .createDIV('group-body');
  const bodyEl = html.getElement('group-body')!;

  if (support) {
    new Setting(bodyEl)
      .setName('Donate plugin development')
      .setDesc('If you like this Plugin, consider donating to support continued development.')
      .addButton((bt) => {
        bt.buttonEl.outerHTML = `<a href='https://ko-fi.com/${support.kofiId}' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi3.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>`;
      });
  }
  const lib = new Setting(bodyEl)
    // .setName('Donate @dkani/obsidian-settings-ui development')
    .setDesc('If you like this new Settings-UI, consider donating continued development of this library.')
    .addButton((bt) => {
      bt.buttonEl.outerHTML =
        "<a href='https://ko-fi.com/F1F195IQ5' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi2.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>";
    });
  lib.nameEl.innerHTML = `<strong style="font-size: 0.85em;">Donate @dkani/obsidian-settings-ui</strong>`;
}
