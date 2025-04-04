import { Setting } from 'obsidian';
import { SettingElement } from '.';
import { hint } from './hint';

export function renderSetting<T extends Record<string, any>, K extends keyof T>(
  container: HTMLElement,
  element: SettingElement<K>,
  settings: T,
  saveData: (settings: T) => Promise<void>,
  groupMember: boolean = false
) {
  const setting = new Setting(container).setName(element.name);

  if (groupMember) {
    setting.settingEl.addClass('dkani-ui-group-item');
  } else {
    setting.settingEl.addClass('dkani-ui-item');
  }

  const key = element.item;
  const value = settings[key];

  if (typeof value === 'boolean') {
    setting.addToggle((toggle) => {
      toggle.toggleEl.classList.add('dkani-ui-item');
      toggle.setValue(value).onChange(async (val) => {
        settings[key] = val as T[K];
        await saveData(settings);
      });
      if (element.placeholder) toggle.setTooltip(element.placeholder);
    });
  } else {
    setting.addText((text) => {
      text.inputEl.classList.add('dkani-ui-item');

      text.setValue(String(value)).onChange(async (val) => {
        if (typeof value === 'number') {
          const parsed = parseFloat(val);
          if (!isNaN(parsed)) {
            settings[key] = parsed as T[K];
            await saveData(settings);
          }
        } else {
          settings[key] = val.trim() as T[K];
          await saveData(settings);
        }
        await saveData(settings);
      });
      if (element.customInputClass) {
        text.inputEl.classList.add(element.customInputClass);
      }
      if (element.placeholder) {
        text.setPlaceholder(element.placeholder);
      }
      if (element.hint) {
        hint(setting, String(key), element.hint);
      }
    });
    if (element.desc) {
      setting.controlEl.createEl('small', { text: element.desc });
    }
  }
}
