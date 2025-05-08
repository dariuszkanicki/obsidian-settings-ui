import type { Setting } from 'obsidian';
import { PathSetting, BaseSetting, LocalizedSetting, Numberfield } from '../renderer/types.js';
import { ContextService } from './context-service.js';
import { createInteractiveTooltip, createTooltip } from './tooltip.js';
import { getValue, getDefaultValue } from './value-utils.js';
import { textTranslation, translation } from './translation.js';

export function highlightAsCode(container: HTMLElement, text: string) {
  container.empty();
  const parts = text.split(/(`[^`]+`)/);
  for (const part of parts) {
    if (part.startsWith('`') && part.endsWith('`')) {
      container.createEl('code', {
        text: part.slice(1, -1),
        cls: css('label-code'),
      });
    } else {
      container.createEl('span', { text: part });
    }
  }
}
export function highlightTextAsCode(text: string): string {
  const parts = text.split(/(`[^`]+`)/);
  return parts
    .map((part) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        const code = escapeHtml(part.slice(1, -1));
        return `<code class="${css('label-code')}">${code}</code>`;
      } else {
        // return escapeHtml(part);
        return part;
      }
    })
    .join('');
}
function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

export function highlightTextAsCodeMarkdown(text: string): string {
  const parts = text.split(/(`[^`]+`)/);
  return parts
    .map((part) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return part; // Keep the code span as-is
      } else {
        return escapeMarkdown(part); // Escape surrounding text
      }
    })
    .join('');
}
function escapeMarkdown(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/[*_~`]/g, '\\$&')
    .replace(/#/g, '\\#')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/>/g, '\\>');
}

export function css(className: string | string[]): string {
  const prefix = `${ContextService.pluginId()}-dkani-ui-`;
  if (Array.isArray(className)) {
    return className.map((cls) => (cls.startsWith(prefix) ? cls : `${prefix}${cls}`)).join(' ');
  }
  return className.startsWith(prefix) ? className : `${prefix}${className}`;
}

export function defaultBar<T>(noDefaultValueBar: boolean | undefined, setting: Setting, element: PathSetting<T>) {
  if (noDefaultValueBar === true || element.handler) {
    return;
  }

  const inputEl = setting.controlEl.firstChild!;
  let optionalElements = [];
  setting.controlEl.removeChild(inputEl);
  while (setting.controlEl.firstChild !== null) {
    optionalElements.push(setting.controlEl.removeChild(setting.controlEl.firstChild));
  }

  let currentValue = getValue(element);
  let defaultValue = getDefaultValue(element);

  if (typeof currentValue === 'object') {
    currentValue = JSON.stringify(currentValue);
  }
  if (typeof defaultValue === 'object') {
    defaultValue = JSON.stringify(defaultValue);
  }

  const itemWrapper = setting.controlEl.createDiv({ cls: css('input-wrapper') });
  const iconWrapper = itemWrapper.createDiv({ cls: css('icon-wrapper') });
  const iconSpan = iconWrapper.createSpan({ cls: css('default-icon') });
  if (currentValue !== defaultValue) {
    iconSpan.style.cssText = 'display: none';
  }
  createTooltip(iconSpan, textTranslation('defaultValue').text, { position: 'bottom' });

  itemWrapper.appendChild(iconWrapper);
  itemWrapper.appendChild(inputEl);
  optionalElements.forEach((optionalElement) => {
    itemWrapper.appendChild(optionalElement);
  });
}

export function tooltip<T>(setting: Setting, element: BaseSetting | PathSetting<T>, addition: string) {
  let text = translation(element, 'tooltip', element.tooltip, element.tooltipParameters);
  if (text) {
    text = highlightTextAsCode(`${text}\n${addition}`);
    const tooltipIcon = setting.nameEl.createSpan({ cls: css('tooltip-icon'), text: 'ℹ️' });
    createInteractiveTooltip(tooltipIcon, text, { position: 'bottom' });
  }
}
export function tooltip4Radioitem<T>(setting: Setting, element: BaseSetting | PathSetting<T>, parent: PathSetting<T>) {
  let text = translation(element, 'tooltip', element.tooltip, parent.tooltipParameters);
  if (text) {
    text = highlightTextAsCode(`${text}`);
    const tooltipIcon = setting.nameEl.createSpan({ cls: css('tooltip-icon'), text: 'ℹ️' });
    createInteractiveTooltip(tooltipIcon, text, { position: 'bottom' });
  }
}

export function hint<T>(setting: Setting, element: BaseSetting | PathSetting<T>) {
  let small: HTMLElement | undefined;
  const descString = translation(element, 'hint', element.hint, element.hintParameters);
  if (descString) {
    small = setting.controlEl.createEl('small', { text: descString });
  }
  return small;
}

export function previewAsHint(setting: Setting, htmlString: string) {
  const small = setting.controlEl.createEl('small');
  const template = document.createElement('template');
  template.innerHTML = htmlString.trim(); // parses HTML safely

  if (template.content.firstChild) {
    small.appendChild(template.content.firstChild);
  }
  return small;
}
