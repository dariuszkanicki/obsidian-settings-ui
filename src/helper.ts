import { Setting } from 'obsidian';
import { Path } from './path';

export class Helper<T extends Record<string, any>> {
  constructor(private pluginId: string) {}

  hint(setting: Setting, element: { path?: Path<T>; hint?: string }) {
    const hintWrapper = document.createElement('span');
    hintWrapper.className = this.css('dkani-ui-hint-wrapper');

    const hintIcon = document.createElement('span');
    hintIcon.className = this.css('dkani-ui-hint-icon');
    hintIcon.tabIndex = 0;
    hintIcon.innerText = 'ℹ️';

    const uid = `hint-${String(element.path)}`;
    hintIcon.setAttribute('aria-describedby', uid);

    const tooltip = document.createElement('div');
    tooltip.className = this.css('dkani-ui-tooltip');
    tooltip.id = uid;
    tooltip.role = 'tooltip';
    tooltip.innerText = element.hint ?? '';

    hintWrapper.appendChild(hintIcon);
    hintWrapper.appendChild(tooltip);
    setting.nameEl.appendChild(hintWrapper);
  }

  setParsedName(container: HTMLElement, label: string) {
    container.empty();
    const parts = label.split(/(`[^`]+`)/);
    for (const part of parts) {
      if (part.startsWith('`') && part.endsWith('`')) {
        container.createEl('code', {
          text: part.slice(1, -1),
          cls: this.css('dkani-ui-label-code'),
        });
      } else {
        container.createEl('span', { text: part });
      }
    }
  }

  css(className: string | string[]): string {
    const prefix = `${this.pluginId}-`;
    if (Array.isArray(className)) {
      return className.map((cls) => (cls.startsWith(prefix) ? cls : `${prefix}${cls}`)).join(' ');
    }
    return className.startsWith(prefix) ? className : `${prefix}${className}`;
  }
}

export function addCodeHighlightedText(container: HTMLElement, className: string, label: string) {
  container.empty();
  const parts = label.split(/(`[^`]+`)/);
  for (const part of parts) {
    if (part.startsWith('`') && part.endsWith('`')) {
      container.createEl('code', {
        text: part.slice(1, -1),
        cls: className, // this.css('dkani-ui-label-code'),
      });
    } else {
      container.createEl('span', { text: part });
    }
  }
}
