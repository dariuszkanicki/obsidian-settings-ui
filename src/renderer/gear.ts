import { setIcon } from 'obsidian';
import { css, getLocalStorage, setLocalStorage } from '../utils/helper';
import path from 'path';
import { ContextService } from '../utils/context-service';

export async function renderGear<T>(bodyEl: HTMLElement) {
  const settingsPanel = bodyEl.createEl('div', { cls: css('settings-slideout') });
  const status = getLocalStorage('slideout') ?? 'closed';
  if (status === 'opened') {
    settingsPanel.classList.add('visible');
  }
  await _createLanguageChoice(settingsPanel);
  _createGearIcon(bodyEl, settingsPanel);
  _createCloseIcon(settingsPanel);
  _createLabelWidthControl(100, 500, settingsPanel);
  setLocalStorage('settings-font-size', '14');
  // this._createFontSizeControl(8, 20);
}
async function _createLanguageChoice(settingsPanel: HTMLElement) {
  const currentLang = getLocalStorage('#lang') ?? 'en';

  const { divEl, id, labelEl } = _createLabel(settingsPanel, 'Languages');
  const langs = await _getAvailableLanguages();
  langs.forEach((lang) => {
    const btn = divEl.createEl('button', {
      text: lang.toUpperCase(),
      cls: css('lang-btn'),
    });
    if (lang === currentLang) {
      btn.addClass('current');
    }
    btn.dataset.lang = lang;
    btn.onclick = (ev) => {
      const target = ev.currentTarget as HTMLElement;
      const selectedLang = target.dataset.lang!;
      setLocalStorage('#lang', selectedLang);
      ContextService.refreshSettings();
    };
  });
}
async function _getAvailableLanguages(): Promise<string[]> {
  const folder = `.obsidian/plugins/${ContextService.pluginId()}`;
  const entries = (await ContextService.app().vault.adapter.list(folder)).files;
  const settingsFiles = entries
    .map((fullPath: string) => path.basename(fullPath))
    .filter((fileName: string) => /^settings-[\w-]+\.json$/.test(fileName));
  const languageSuffixes = settingsFiles.map((file: { match: (arg0: RegExp) => any[] }) => file.match(/^settings-(.+)\.json$/)?.[1]!);
  return languageSuffixes;
}

function _createGearIcon(bodyEl: HTMLElement, settingsPanel: HTMLElement) {
  const gearIcon = bodyEl.createEl('div', {
    cls: css('gear-icon'),
  });
  gearIcon.innerHTML = '⚙️'; // Or insert an `<img>` or SVG
  gearIcon.onclick = () => {
    settingsPanel.classList.add('visible');
    setLocalStorage('slideout', 'opened');
  };
}

function _createCloseIcon(settingsPanel: HTMLElement) {
  const closeButton = settingsPanel.createEl('div');
  setIcon(closeButton, 'circle-x');
  closeButton.classList.add(css('gear-close-button'));
  closeButton.addEventListener('click', () => {
    settingsPanel.classList.remove('visible');
    setLocalStorage('slideout', 'closed');
  });
}

function _createLabelWidthControl(min: number, max: number, settingsPanel: HTMLElement) {
  const width = getLocalStorage('settings-label-width') ?? 200;
  // prettier-ignore
  _createInput(settingsPanel, 'Label Width', 'number', min, max, width, async (val: string) => {
    setLocalStorage('settings-label-width', val);
    ContextService.refreshSettings();
  });
}

function _createFontSizeControl(min: number, max: number, settingsPanel: HTMLElement) {
  const fontSize = getLocalStorage('settings-font-size') ?? 14;
  // prettier-ignore
  _createInput(settingsPanel, 'Font Size', 'number', min, max, fontSize, async (val: string) => {
    // document.body.style.setProperty('--font-ui-medium', `${val}px`);
    setLocalStorage('settings-font-size', val);
    ContextService.refreshSettings();
  });
  // document.body.style.setProperty('--font-ui-medium', `${fontSize}px`);
  setLocalStorage('settings-font-size', fontSize);
}

function _createLabel(parent: HTMLElement, label: string) {
  const divEl = parent.createDiv({ cls: 'gear-setting' });
  const id = label.toLowerCase().replace(/\s+/g, '-') + '-setting';
  const labelEl = divEl.createEl('label', { text: label });
  labelEl.setAttr('style', `width:100px; margin-right:8px; display:inline-block`);

  return { divEl: divEl, id: id, labelEl: labelEl };
}

// prettier-ignore
function _createInput(
  parent: HTMLElement,
  label:  string,
  type:   string,
  min:    number,
  max:    number,
  init:   number,
  update: (value: string) => Promise<void>
) {
  const { divEl, id, labelEl} = _createLabel(parent, label);
  // const divEl = parent.createDiv({ cls: 'gear-setting' });
  // const id = label.toLowerCase().replace(/\s+/g, '-') + '-setting';
  // const labelEl = divEl.createEl('label', { text: label });
  labelEl.setAttr('for', id);
  const inputEl = divEl.createEl('input');
  inputEl.type = type;
  inputEl.id = id;
  inputEl.min = String(min);
  inputEl.max = String(max);
  inputEl.value = String(init);

  inputEl.setAttr('style', 'width:45px; margin-right:4px; margin-bottom:5px; text-align: right');
  divEl.createEl('label', { text: 'px' });

  inputEl.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === 'Tab') {
      const val = Number(inputEl.value);
      if (!isNaN(val)) {
        const clamped = Math.max(min, Math.min(max, val));
        const value = clamped.toString();
        inputEl.value = value;
        update(value);
      }
    }
  });
}
