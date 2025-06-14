import { Html, Tag } from '../../utils/html.js';
import { isSettingGroupExpanded, setSettingGroupExpanded } from '../../utils/storage.js';
import { tooltip4Group } from '../../utils/tooltip-helper.js';
import { translateElementPart } from '../../utils/translation.js';
import type { SettingGroup } from '../types-api.js';
import type { HowToSection } from '../types-api.js';

export class GroupRenderer {
  constructor(private container: HTMLElement) {}

  render<T>(element: SettingGroup<T> | HowToSection): HTMLElement {
    const label = translateElementPart(element, 'label', element.label) ?? 'unknown';

    const html = new Html(this.container);
    // prettier-ignore
    html.createDIV('group')
      .createDIV('group-header')
      .createSPAN('group-toggle', '▼', Tag.close)
      .createDIV('group-title', label, Tag.close)
      .closeTag()
      .createDIV('group-body');

    let expanded = isSettingGroupExpanded(label);
    const bodyEl = html.getElement('group-body')!;
    const toggleIcon = html.getElement('group-toggle')!;
    const titleEl = html.getElement('group-title')!;

    tooltip4Group(titleEl, element);

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
      setSettingGroupExpanded(label, expanded);
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
