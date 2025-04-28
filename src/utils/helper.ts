import type { Setting } from 'obsidian';
import type { BaseSetting, LocalizedSetting, PathSetting } from '../renderer/types';
import { ContextService } from './context-service';
import { replacePlaceholders } from '../renderer/impl/setting-helper';
import { createIcons, icons } from 'lucide';

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

export function defaultButton<T>(setting: Setting, element: PathSetting<T>) {
  // const result = translation(
  //   element,
  //   "tooltip",
  //   element.tooltip,
  //   element.tooltipParameters,
  // );
  // if (result) {
  // const wrapper = document.createElement('span');
  // wrapper.className = css('icon-wrapper');

  // const tooltipIcon = wrapper.createEl('span', { cls: [css('default-icon'), 'file-json-icon'] });
  // tooltipIcon.tabIndex = 0;
  // tooltipIcon.onclick = (ev) => {
  //   alert('clicked!');
  // };
  // const id = element.path;
  // const uid = `tooltip-${id}`;
  // tooltipIcon.setAttribute('aria-describedby', uid);

  // const tooltipDiv = document.createElement('div');
  // tooltipDiv.className = css('tooltip');
  // tooltipDiv.id = uid;
  // tooltipDiv.role = 'tooltip';
  // // tooltipDiv.innerText = result;
  // wrapper.appendChild(tooltipIcon);

  const inputEl = setting.controlEl.firstChild!;
  let optionalElement;
  setting.controlEl.removeChild(inputEl);
  if (setting.controlEl.firstChild !== null) {
    optionalElement = setting.controlEl.removeChild(setting.controlEl.firstChild);
  }

  const itemWrapper = setting.controlEl.createDiv({ cls: 'dkani-ui-input-wrapper' });
  // itemWrapper.appendChild(wrapper);
  _addIcon(itemWrapper, element, 'file-json-icon');
  itemWrapper.appendChild(inputEl);
  if (optionalElement) {
    itemWrapper.appendChild(optionalElement);
  }
}

function _addIcon<T>(container: HTMLElement, element: PathSetting<T>, iconName: string) {
  const span = container.createSpan({ cls: css('icon-wrapper') });
  const icon = span.createSpan({ cls: [css('default-icon'), `${iconName}`] });
  // icon.tabIndex = 0;
  icon.onclick = (ev) => {
    alert('clicked!');
  };
  const uid = `tooltip-${element.path}-${iconName}`;
  icon.setAttribute('aria-describedby', uid);

  // const tooltipDiv = document.createElement('div');
  // tooltipDiv.className = css('tooltip');
  // tooltipDiv.id = uid;
  // tooltipDiv.role = 'tooltip';
  // tooltipDiv.innerText = result;
  span.appendChild(icon);
}

export function tooltip<T>(setting: Setting, element: BaseSetting | PathSetting<T>) {
  const result = translation(element, 'tooltip', element.tooltip, element.tooltipParameters);
  if (result) {
    const wrapper = document.createElement('span');
    wrapper.className = css('icon-wrapper');

    const tooltipIcon = document.createElement('span');
    tooltipIcon.className = css('tooltip-icon');
    tooltipIcon.tabIndex = 0;
    tooltipIcon.innerText = 'ℹ️';
    const id = 'path' in element ? element.path : element.id;
    const uid = `tooltip-${id}`;
    tooltipIcon.setAttribute('aria-describedby', uid);

    const tooltipDiv = document.createElement('div');
    tooltipDiv.className = css('tooltip');
    tooltipDiv.id = uid;
    tooltipDiv.role = 'tooltip';
    tooltipDiv.innerText = result;

    wrapper.appendChild(tooltipIcon);
    wrapper.appendChild(tooltipDiv);
    setting.nameEl.appendChild(wrapper);
  }
}

export function hint<T>(noHint: boolean | undefined, setting: Setting, element: BaseSetting | PathSetting<T>) {
  let small: HTMLElement | undefined;

  if (noHint === undefined || !noHint) {
    const descString = translation(element, 'hint', element.hint);
    if (descString) {
      small = setting.controlEl.createEl('small', { text: descString });
    }
  }
  return small;
}

export function getTranslation<T>(element: BaseSetting | PathSetting<T>) {
  const key = 'path' in element ? element.path : (element.id ?? '');
  if (key) {
    return ContextService.settingsMap().get(key); // LocalizedSetting
  }
  return undefined;
}

export function translation<T>(element: BaseSetting | PathSetting<T>, item: string, elementString?: string, replacements?: string[]) {
  const translation = getTranslation(element);
  let result = elementString;
  const translated = translation ? translation[item as keyof LocalizedSetting] : undefined;
  if (translated) {
    if (replacements) {
      result = replacePlaceholders(translated, replacements);
    } else {
      result = translated;
    }
  }
  return result;
}
