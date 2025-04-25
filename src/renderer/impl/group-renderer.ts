import { ContextService } from '../../utils/context-service';
import { Html, Tag } from '../../utils/html';
import { isSettingGroupExpanded, setSettingGroupExpanded } from '../../utils/storage';

export class GroupRenderer {
  constructor(private container: HTMLElement) {}

  render(label: string): HTMLElement {
    const html = new Html(this.container);
    // prettier-ignore
    html.createDIV('group')
      .createDIV('group-header')
        .createSPAN('group-toggle', '▼', Tag.close)
        .createDIV('group-title', label, Tag.close)
      .closeTag()
      .createDIV('group-body');

    let expanded = isSettingGroupExpanded(label);
    console.log('expanded', expanded, typeof expanded);
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
