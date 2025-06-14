import type { Setting } from 'obsidian';
import type { PathSetting } from '../renderer/types.js';
import { translateElementPart } from './translation.js';

export function previewAsHint(setting: Setting, htmlString: string) {
  const small = setting.controlEl.createEl('small');
  const template = document.createElement('template');
  template.innerHTML = htmlString.trim(); // parses HTML safely

  if (template.content.firstChild) {
    small.appendChild(template.content.firstChild);
  }
  return small;
}
export function hint<T>(setting: Setting, element: PathSetting<T>) {
  let small: HTMLElement | undefined;
  const descString = translateElementPart(element, 'hint', element.hint);
  if (descString) {
    small = setting.controlEl.createEl('small', { text: descString });
  }
  return small;
}
