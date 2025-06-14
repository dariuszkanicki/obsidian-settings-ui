import { setIcon } from 'obsidian';
import path from 'path';
import { ContextService } from '../utils/context-service.js';
import { css } from '../utils/helper.js';
import {
  getGearSlideout,
  setDefaultSettingFontSize,
  getCurrentLanguage,
  setCurrentLanguage,
  setGearSlideout,
  getSettingLabelWidth,
  setSettingLabelWidth,
  getSettingFontSize,
  setSettingFontSize,
} from '../utils/storage.js';
import { refreshDisplayWithDelay } from '../utils/setting-utils.js';

export async function renderGear(bodyEl: HTMLElement) {
  const settingsPanel = bodyEl.createEl('div', {
    cls: css('settings-slideout'),
  });
  const status = getGearSlideout();
  if (status === 'opened') {
    settingsPanel.classList.add('visible');
  }
  await _createLanguageChoice(settingsPanel);
  _createGearIcon(bodyEl, settingsPanel);
  _createCloseIcon(settingsPanel);
  _createLabelWidthControl(100, 500, settingsPanel);
  setDefaultSettingFontSize();
  // this._createFontSizeControl(8, 20);

  function _createLabel(parent: HTMLElement, label: string, forId: boolean) {
    const divEl = parent.createDiv({ cls: 'gear-setting' });
    const id = label.toLowerCase().replace(/\s+/g, '-') + '-setting';
    const labelEl = divEl.createEl('label', { text: label });
    labelEl.setAttr('style', '`width:100px; margin-right:8px; display:inline-block`');
    if (forId) {
      labelEl.setAttr('for', id);
    }

    return { divEl: divEl, id: id };
  }

  async function _createLanguageChoice(settingsPanel: HTMLElement) {
    const currentLang = getCurrentLanguage();

    const { divEl } = _createLabel(settingsPanel, 'Languages', false);
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
      btn.onclick = async (ev) => {
        const target = ev.currentTarget as HTMLElement;
        const selectedLang = target.dataset.lang!;
        setCurrentLanguage(selectedLang);
        refreshDisplayWithDelay();
      };
    });
  }

  async function _getAvailableLanguages(): Promise<string[]> {
    const folder = `.obsidian/plugins/${ContextService.pluginId()}`;
    const entries = (await ContextService.app().vault.adapter.list(folder)).files;
    const settingsFiles = entries
      .map((fullPath: string) => path.basename(fullPath))
      .filter((fileName: string) => /^settings-[\w-]+\.json$/.test(fileName));
    const languageSuffixes = settingsFiles
      .map((file) => file.match(/^settings-(.+)\.json$/)?.[1])
      .filter((suffix): suffix is string => !!suffix); // optional: filter out nulls
    return languageSuffixes;
  }

  function _createGearIcon(bodyEl: HTMLElement, settingsPanel: HTMLElement) {
    const gearIcon = bodyEl.createEl('div', {
      cls: css('gear-icon'),
    });
    gearIcon.innerHTML = '⚙️'; // Or insert an `<img>` or SVG
    gearIcon.onclick = () => {
      settingsPanel.classList.add('visible');
      setGearSlideout('opened');
    };
  }

  function _createCloseIcon(settingsPanel: HTMLElement) {
    const closeButton = settingsPanel.createEl('div');
    setIcon(closeButton, 'circle-x');
    closeButton.classList.add(css('gear-close-button'));
    closeButton.addEventListener('click', () => {
      settingsPanel.classList.remove('visible');
      setGearSlideout('closed');
    });
  }

  function _createLabelWidthControl(min: number, max: number, settingsPanel: HTMLElement) {
    const width = getSettingLabelWidth() ?? 200;
    // prettier-ignore
    _createInput(settingsPanel, 'Label Width', 'number', min, max, width, async (val: number) => {
      setSettingLabelWidth(val);
      refreshDisplayWithDelay();
    });

    // not used at the moment
    function _createFontSizeControl(min: number, max: number, settingsPanel: HTMLElement) {
      const fontSize = getSettingFontSize() ?? 14;
      _createInput(settingsPanel, 'Font Size', 'number', min, max, fontSize, async (val: number) => {
        setSettingFontSize(val);
        refreshDisplayWithDelay();
      });
      setSettingFontSize(fontSize);
    }

    // prettier-ignore
    function _createInput(
      parent: HTMLElement,
      label: string,
      type: string,
      min: number,
      max: number,
      init: number,
      update: (value: number) => Promise<void>
    ) {
      const { divEl, id } = _createLabel(parent, label, true);
      const inputEl = divEl.createEl('input');
      inputEl.type = type;
      inputEl.id = id;
      inputEl.min = String(min);
      inputEl.max = String(max);
      inputEl.value = String(init);

      inputEl.setAttr('style', 'width:45px; margin-right:4px; margin-bottom:5px; text-align: right');
      divEl.createEl('label', { text: 'px' });

      inputEl.onblur = async () => {
        const val = Number(inputEl.value);
        if (!isNaN(val)) {
          const clamped = Math.max(min, Math.min(max, val));
          const value = clamped.toString();
          inputEl.value = value;
          await update(clamped);
        }
      }
    }
  }
}
