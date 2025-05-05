import type { Setting } from 'obsidian';
import { PathSetting, BaseSetting, LocalizedSetting } from '../renderer/types.js';
import { ContextService } from './context-service.js';
import { createInteractiveTooltip, createTooltip } from './tooltip.js';
import { getValue, getDefaultValue } from './value-utils.js';
import { textTranslation, translation } from './translation.js';

export function addCodeHighlightedText(container: HTMLElement, label: string) {
  container.empty();
  const parts = label.split(/(`[^`]+`)/);
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
  let optionalUnitElement;
  setting.controlEl.removeChild(inputEl);
  if (setting.controlEl.firstChild !== null) {
    optionalUnitElement = setting.controlEl.removeChild(setting.controlEl.firstChild);
  }

  const currentValue = getValue(element);
  const defaultValue = getDefaultValue(element);

  const itemWrapper = setting.controlEl.createDiv({ cls: css('input-wrapper') });
  const iconWrapper = itemWrapper.createDiv({ cls: css('icon-wrapper') });
  const iconSpan = iconWrapper.createSpan({ cls: css('default-icon') });
  if (currentValue !== defaultValue) {
    iconSpan.style.cssText = 'display: none';
  }
  createTooltip(iconSpan, textTranslation('defaultValue').text, { position: 'bottom' });

  itemWrapper.appendChild(iconWrapper);
  itemWrapper.appendChild(inputEl);
  if (optionalUnitElement) {
    itemWrapper.appendChild(optionalUnitElement);
  }
}

export function tooltip<T>(setting: Setting, element: BaseSetting | PathSetting<T>) {
  const result = translation(element, 'tooltip', element.tooltip, element.tooltipParameters);
  if (result) {
    const tooltipIcon = setting.nameEl.createSpan({ cls: css('tooltip-icon'), text: 'ℹ️' });
    // createTooltip(tooltipIcon, result, { position: 'bottom' });
    createInteractiveTooltip(tooltipIcon, result, { position: 'bottom' });

  }
}

export function hint<T>(noHint: boolean | undefined, setting: Setting, element: BaseSetting | PathSetting<T>) {
  let small: HTMLElement | undefined;

  if (noHint === undefined || !noHint) {
    const descString = translation(element, 'hint', element.hint, element.hintParameters);
    if (descString) {
      small = setting.controlEl.createEl('small', { text: descString });
    }
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