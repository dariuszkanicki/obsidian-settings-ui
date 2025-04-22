import { Html, Tag } from '../../utils/html';

export class GroupRenderer {
  constructor(private pluginId: string, private container: HTMLElement) {}

  render(label: string): HTMLElement {
    const html = new Html(this.pluginId, this.container, 'dkani-ui');
    // prettier-ignore
    html.createDIV('group')
      .createDIV('group-header')
        .createSPAN('group-toggle', '▼', Tag.close)
        .createDIV('group-title', label, Tag.close)
      .closeTag()
      .createDIV('group-body');

    const key = `${this.pluginId}-dkani-ui-group:${label}`;
    let expanded = localStorage.getItem(key) !== 'false';
    const bodyEl = html.getElement('group-body')!;
    const toggleIcon = html.getElement('group-toggle')!;
    const titleEl = html.getElement('group-title')!;

    const applyState = () => {
      if (expanded) {
        bodyEl.style.maxHeight = 'none';
        toggleIcon.setText('▼');
        bodyEl.classList.remove('collapsed');
      } else {
        bodyEl.style.maxHeight = '0px';
        toggleIcon.setText('▶');
        bodyEl.classList.add('collapsed');
      }
    };

    const toggle = () => {
      expanded = !expanded;
      localStorage.setItem(key, String(expanded));
      if (expanded) {
        bodyEl.classList.remove('collapsed');
        bodyEl.style.maxHeight = bodyEl.scrollHeight + 'px';
        toggleIcon.setText('▼');
      } else {
        bodyEl.style.maxHeight = bodyEl.scrollHeight + 'px';
        requestAnimationFrame(() => (bodyEl.style.maxHeight = '0px'));
        toggleIcon.setText('▶');
        bodyEl.classList.add('collapsed');
      }
    };

    toggleIcon.addEventListener('click', toggle);
    titleEl.addEventListener('click', toggle);
    bodyEl.addEventListener('transitionend', () => {
      if (expanded) bodyEl.style.maxHeight = 'none';
    });

    applyState();
    return bodyEl;
  }
}
