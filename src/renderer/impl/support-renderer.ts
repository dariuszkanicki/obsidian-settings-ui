import { Setting } from 'obsidian';
import { Html, Tag } from '../../utils/html.js';
import { translateString } from '../../utils/translation.js';

export function renderSupportSection(container: HTMLElement) {
  const groupTitle = translateString({ id: 'supportGroup' }, 'label') ?? 'Support';
  console.log('groupTitle', groupTitle);
  const html = new Html(container);
  // prettier-ignore
  html.createDIV('group')
    .createDIV('group-header')
    .createDIV('group-title', groupTitle, Tag.close)
    .closeTag()
    .createDIV('group-body');
  const bodyEl = html.getElement('group-body')!;

  new Setting(bodyEl)
    .setName('Donate plugin development')
    .setDesc('If you like this Plugin, consider donating to support continued development.')
    .addButton((bt) => {
      bt.buttonEl.outerHTML =
        "<a href='https://ko-fi.com/F1F195IQ5' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi3.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>";
    });
  new Setting(bodyEl)
    .setName('Donate @dkani/obsidian-settings-ui development')
    .setDesc('If you like this new Settings-UI, consider donating continued development of this library.')
    .addButton((bt) => {
      bt.buttonEl.outerHTML =
        "<a href='https://ko-fi.com/F1F195IQ5' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi2.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>";
    });
}
