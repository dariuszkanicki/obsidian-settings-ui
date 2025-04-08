import { Setting } from 'obsidian';
import { SettingElement, SettingsElement, SettingsSectionConfig, StatusField } from '..';

export class Renderer<T extends Record<string, any>> {
  constructor(
    private pluginId: string,
    private config: SettingsSectionConfig<T>,
    private settings: T,
    private container: HTMLElement,
    private saveData: (settings: T) => Promise<void>
  ) {}

  renderSettings() {
    this.container.empty();

    if (this.config.howTo) {
      this._renderHowToSection();
    }

    for (const el of this.config.elements) {
      if ('type' in el && el.type === 'group') {
        const groupEl = this.container.createEl('div', {
          cls: this._css('dkani-ui-group'),
        });
        groupEl.createEl('div', {
          text: el.title,
          cls: this._css('dkani-ui-group-title'),
        });

        el.items.forEach((item) => {
          this._renderElement(groupEl, item);
        });
      } else {
        this._renderElement(this.container, el);
      }
    }
  }

  private _renderHowToSection() {
    const { title, description, readmeURL, classes = {} } = this.config.howTo;

    const howto = this.container.createEl('div', {
      cls: classes.wrapper ?? this._css('dkani-ui-howto'),
    });

    console.log("CSS", this._css('dkani-ui-howto'));

    howto.createEl('div', {
      text: title ?? 'How to use this plugin',
      cls: classes.title ?? this._css('dkani-ui-howto-title'),
    });
    const small = howto.createEl('small', {
      text: description,
      cls: classes.description ?? this._css('dkani-ui-howto-text'),
    });
    if (readmeURL) {
      small.createEl('br');
      small.createEl('br');
      small.createEl('span', { text: 'See the ' });
      small.createEl('a', {
        href: readmeURL,
        text: 'README',
        title: readmeURL,
      });
      small.createEl('span', {
        text: ' for more information and troubleshooting.',
      });
    }
  }
  _isSettingElement<T>(el: SettingsElement<T>): el is SettingElement<Extract<keyof T, string>> {
    return !('items' in el);
  }

  private _renderElement(
    container: HTMLElement,
    el: SettingsElement<T>
  ) {
    if ("type" in el && el.type === "status") {
      const setting = new Setting(container).setName(el.title);
      this._renderStatusLine(setting, el.items);
    } else if (this._isSettingElement(el)) {
      const key = el.item as Extract<keyof T, string>;
      this._renderSetting(container, { ...el, item: key });
    }
  }
  
  private _renderStatusLine(setting: Setting, fields: StatusField[]) {
    const wrapper = document.createElement("div");
    wrapper.className = this._css("dkani-ui-status-wrapper");
  
    fields.forEach(({ text, color = "gray", textColor = "white" }) => {
      const pill = document.createElement("div");
      pill.className = this._css("dkani-ui-status-pill");
      pill.style.backgroundColor = color;
      pill.style.color = textColor;
      pill.innerText = text;
      wrapper.appendChild(pill);
    });
    setting.controlEl.appendChild(wrapper);
  }

  private _renderSetting<K extends Extract<keyof T, string>>(
    container: HTMLElement,
    element: SettingElement<K>,
    groupMember: boolean = false
  ) {
    const setting = new Setting(container).setName(element.name);
  
    if (groupMember) {
      setting.settingEl.addClass('dkani-ui-group-item');
    } else {
      setting.settingEl.addClass('dkani-ui-item');
    }
  
    const key = element.item;
    const value = this.settings[key];
  
    if (typeof value === 'boolean') {
      setting.addToggle((toggle) => {
        toggle.toggleEl.classList.add('dkani-ui-item');
        toggle.setValue(value).onChange(async (val) => {
          this.settings[key] = val as T[K];
          await this.saveData(this.settings);
          if (element.postSave) {
            element.postSave();
          }
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
              this.settings[key] = parsed as T[K];
              await this.saveData(this.settings);
            }
          } else {
            this.settings[key] = val.trim() as T[K];
            await this.saveData(this.settings);
          }
          await this.saveData(this.settings);
        });
        if (element.customInputClass) {
          text.inputEl.classList.add(element.customInputClass);
        }
        if (element.placeholder) {
          text.setPlaceholder(element.placeholder);
        }
        if (element.hint) {
          this._hint(setting, String(key), element.hint);
        }
      });
      if (element.desc) {
        setting.controlEl.createEl('small', { text: element.desc });
      }
    }
  }

  private _hint(setting: Setting, key: string, hint: string) {
    const hintWrapper = document.createElement('span');
    hintWrapper.className = this._css('dkani-ui-hint-wrapper');
  
    const hintIcon = document.createElement('span');
    hintIcon.className = this._css('dkani-ui-hint-icon');
    hintIcon.tabIndex = 0;
    hintIcon.innerText = 'ℹ️';
    const uid = `hint-${key}`;
    hintIcon.setAttribute('aria-describedby', uid);
  
    const tooltip = document.createElement('div');
    tooltip.className = this._css('dkani-ui-tooltip');
    tooltip.id = uid;
    tooltip.role = 'tooltip';
    tooltip.innerText = hint;
  
    hintWrapper.appendChild(hintIcon);
    hintWrapper.appendChild(tooltip);
    setting.nameEl.appendChild(hintWrapper);
  }

  private _css(className: string | string[]): string {
    const prefix = `${this.pluginId}-`;
    if (Array.isArray(className)) {
      return className
        .map(cls => cls.startsWith(prefix) ? cls : `${prefix}${cls}`)
        .join(' ');
    }
    return className.startsWith(prefix) ? className : `${prefix}${className}`;
  }
}
