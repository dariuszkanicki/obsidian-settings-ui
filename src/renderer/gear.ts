import { App, Plugin, setIcon } from 'obsidian';
import { ConfigContext } from './types';
import { getLocalStorage, setLocalStorage } from '../i18n/loader';
import { css, prefixed } from '../utils/helper';
import path from 'path';

export async function renderGear<T extends Record<string, any>>(context: ConfigContext<T>, bodyEl: HTMLElement) {
  await new GearRenderer(context.app, context.plugin, context.pluginId, context.refreshSettings).render(bodyEl);
}

class GearRenderer {
  private settingsPanel!: HTMLElement;
  private gearIcon!: HTMLElement;

  constructor(private add: App, private plugin: Plugin, private pluginId: string, private refreshSettings: () => Promise<void>) {}

  async render(bodyEl: HTMLElement) {
    this.settingsPanel = bodyEl.createEl('div', { cls: prefixed(this.pluginId, 'settings-slideout') });
    const status = getLocalStorage(this.plugin, 'slideout') ?? 'closed';
    if (status === 'opened') {
      this.settingsPanel.classList.add('visible');
    }
    await this._createLanguageChoice();
    this._createGearIcon(bodyEl);
    this._createCloseIcon();
    this._createLabelWidthControl(100, 500);
    setLocalStorage(this.plugin, 'settings-font-size', '14');
    // this._createFontSizeControl(8, 20);
  }

  private async _createLanguageChoice() {
    const currentLang = getLocalStorage(this.plugin, 'lang') ?? 'en';

    const { divEl, id, labelEl } = this._createLabel(this.settingsPanel, 'Languages');
    const langs = await this._getAvailableLanguages();
    langs.forEach((lang) => {
      const btn = divEl.createEl('button', {
        text: lang.toUpperCase(),
        cls: prefixed(this.pluginId, 'lang-btn'),
      });
      if (lang === currentLang) {
        btn.addClass('current');
      }
      btn.dataset.lang = lang;
      btn.onclick = (ev) => {
        const target = ev.currentTarget as HTMLElement;
        const selectedLang = target.dataset.lang!;
        setLocalStorage(this.plugin, 'lang', selectedLang);
        this.refreshSettings();
      };
    });
  }
  private async _getAvailableLanguages(): Promise<string[]> {
    const folder = `.obsidian/plugins/${this.plugin.manifest.id}`;
    const entries = (await this.plugin.app.vault.adapter.list(folder)).files;
    const settingsFiles = entries.map((fullPath) => path.basename(fullPath)).filter((fileName) => /^settings-[\w-]+\.json$/.test(fileName));
    const languageSuffixes = settingsFiles.map((file) => file.match(/^settings-(.+)\.json$/)?.[1]!);
    return languageSuffixes;
  }

  private _createGearIcon(bodyEl: HTMLElement) {
    this.gearIcon = bodyEl.createEl('div', {
      cls: prefixed(this.pluginId, 'gear-icon'),
    });
    this.gearIcon.innerHTML = '⚙️'; // Or insert an `<img>` or SVG
    this.gearIcon.onclick = () => {
      this.settingsPanel.classList.add('visible');
      setLocalStorage(this.plugin, 'slideout', 'opened');
    };
  }
  private _createCloseIcon() {
    const closeButton = this.settingsPanel.createEl('div');
    setIcon(closeButton, 'circle-x');
    closeButton.classList.add(prefixed(this.pluginId, 'gear-close-button'));
    closeButton.addEventListener('click', () => {
      this.settingsPanel.classList.remove('visible');
      setLocalStorage(this.plugin, 'slideout', 'closed');
    });
  }

  private _createLabelWidthControl(min: number, max: number) {
    const width = getLocalStorage(this.plugin, 'settings-label-width') ?? 200;
    // prettier-ignore
    this._createInput(this.settingsPanel, 'Label Width', 'number', min, max, width, async (val: string) => {
      setLocalStorage(this.plugin, 'settings-label-width', val);
      this.refreshSettings();
    });
  }

  private _createFontSizeControl(min: number, max: number) {
    const fontSize = getLocalStorage(this.plugin, 'settings-font-size') ?? 14;
    // prettier-ignore
    this._createInput(this.settingsPanel, 'Font Size', 'number', min, max, fontSize, async (val: string) => {
      // document.body.style.setProperty('--font-ui-medium', `${val}px`);
      setLocalStorage(this.plugin, 'settings-font-size', val);
      this.refreshSettings();
    });
    // document.body.style.setProperty('--font-ui-medium', `${fontSize}px`);
    setLocalStorage(this.plugin, 'settings-font-size', fontSize);
  }

  private _createLabel(parent: HTMLElement, label: string) {
    const divEl = parent.createDiv({ cls: 'gear-setting' });
    const id = label.toLowerCase().replace(/\s+/g, '-') + '-setting';
    const labelEl = divEl.createEl('label', { text: label });
    labelEl.setAttr('style', `width:100px; margin-right:8px; display:inline-block`);

    return { divEl: divEl, id: id, labelEl: labelEl };
  }

  // prettier-ignore
  private _createInput(
    parent: HTMLElement,
    label:  string,
    type:   string,
    min:    number,
    max:    number,
    init:   number,
    update: (value: string) => Promise<void>
) {
    const { divEl, id, labelEl} = this._createLabel(parent, label);
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
}
