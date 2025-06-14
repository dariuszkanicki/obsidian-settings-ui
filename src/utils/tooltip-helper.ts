import type { Setting } from 'obsidian';
import type { PathSetting } from '../renderer/types.js';
import type { Replacement } from '../renderer/types-api.js';
import type { RadioGroup } from '../renderer/types-api.js';
import type { RadioItem } from '../renderer/types-api.js';
import { highlightTextAsCode, css } from './helper.js';
import { createInteractiveTooltip } from './tooltip.js';
import { translateElementPart } from './translation.js';

export function tooltip<T>(setting: Setting, element: PathSetting<T>, addition: string) {
  let text = translateElementPart(element, 'tooltip', element.tooltip);
  if (text) {
    text = highlightTextAsCode(`${text}\n${addition}`);
    const icon = text.startsWith('!') ? '⚠️' : 'ℹ️';
    const cls = text.startsWith('!') ? 'tooltip-icon-warning' : 'tooltip-icon-info';
    text = text.startsWith('!') ? text.substring(1) : text;
    const tooltipIcon = setting.nameEl.createSpan({ cls: css(cls), text: icon });
    createInteractiveTooltip(tooltipIcon, text, { position: 'bottom' });
  }
}

export function tooltip4Radioitem<T>(setting: Setting, element: RadioItem, parent: RadioGroup<T>) {
  const el = { id: element.id, replacements: parent.replacements };
  let text = translateElementPart(el, 'tooltip', undefined);
  if (text) {
    text = highlightTextAsCode(`${text}`);
    const tooltipIcon = setting.nameEl.createSpan({ cls: css('tooltip-icon-info'), text: 'ℹ️' });
    createInteractiveTooltip(tooltipIcon, text, { position: 'bottom' });
  }
}

export function tooltip4Group(parentEl: HTMLElement, element: { id: string; tooltip?: string[]; replacements?: () => Replacement[] }) {
  let text = translateElementPart(element, 'tooltip', element.tooltip);
  if (text) {
    text = highlightTextAsCode(`${text}`);
    const tooltipIcon = parentEl.createSpan({ cls: css('tooltip-icon-info'), text: 'ℹ️' });
    createInteractiveTooltip(tooltipIcon, text, { position: 'bottom' });
  }
}
