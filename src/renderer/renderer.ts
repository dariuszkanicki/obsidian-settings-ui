import { App, Plugin } from 'obsidian';
import { loadLocalizedSettings } from '../i18n/loader.js';
import { ContextService } from '../utils/context-service.js';
import { renderGear } from './gear.js';
import { AbstractBaseRenderer } from './impl/abstract-base-renderer.js';
import { AbstractGroupRenderer } from './impl/abstract-group-renderer.js';
import { AbstractPathRenderer } from './impl/abstract-path-renderer.js';
import { GroupRenderer } from './impl/group-renderer.js';
import { renderHowToSection } from './impl/howto-renderer.js';
import { rendererRegistry } from './registry.js';
import { BaseSetting, PathSetting } from './types.js';
import { ConfigContext, SettingsConfig, GroupSetting, SettingGroup, SettingElement } from './types-api.js';
import { RadioGroup } from './types-api.js';
import { Conditional } from './types-api.js';
import { RadioGroupRenderer } from './impl/radiogroup-renderer.js';
import { getDefaultValue } from '../utils/value-utils.js';
import { renderSupportSection } from './impl/support-renderer.js';

export class Renderer<T> {
  private context: ConfigContext<T>;
  constructor(
    private app: App,
    private plugin: Plugin,
    private config: SettingsConfig<T>,
    private settings: T,
    private defaults: T,
    private container: HTMLElement,
    private saveData: (settings: T) => Promise<void>,
    private refreshSettings: () => Promise<void>,
  ) {
    this.context = {
      app: this.app,
      plugin: this.plugin,
      pluginId: this.plugin.manifest.id,
      settings: this.settings,
      defaults: this.defaults,
      container: this.container,
      saveData: this.saveData,
      localizedSettingMap: null,
      refreshSettings: this.refreshSettings,
    };
  }

  isSettingGroup<T>(el: any): el is SettingGroup<T> {
    return el?.type === 'SettingGroup' && Array.isArray(el.items);
  }

  isConditional<T>(el: any): el is Conditional<T> {
    return el?.type === 'Conditional' && Array.isArray(el.items);
  }

  async renderSettings(): Promise<void> {
    ContextService.initialize(this.context);
    this.context.localizedSettingMap = await loadLocalizedSettings();
    this.container.empty();

    await renderGear(this.container, this.refreshSettings);

    const groupRenderer = new GroupRenderer(this.container);

    if (this.config.howTo) {
      const label = this.config.howTo.label ?? 'How to use this plugin';
      const howtoEl = groupRenderer.render(this.config.howTo);
      renderHowToSection(howtoEl, this.context.pluginId, this.config.howTo);
    }
    for (const el of this.config.elements) {
      if (this.isSettingGroup(el) && el.showIf !== false) {
        const bodyEl = groupRenderer.render(el);
        for (const item of el.items) {
          if (this.isConditional(item)) {
            if (item.showIf === true) {
              for (const conditionalItem of item.items) {
                this._renderElement(bodyEl, conditionalItem, true);
              }
            }
          } else {
            this._renderElement(bodyEl, item, true);
          }
        }
      } else {
        this._renderElement(this.container, el);
      }
    }
    renderSupportSection(this.container, this.config.support);
  }

  private _checkConsistency(el: PathSetting<T>, elType: string, elDataType: string) {
    const datatype = typeof getDefaultValue(el);

    if (datatype === undefined) {
      throw Error(`${el.path}: '${elType}' is missing default value`);
    }

    if (el.type === elType && datatype !== elDataType) {
      throw Error(`${el.path}: '${elType}' specified for default datatype '${datatype}'`);
    } else if (el.type !== elType && datatype === elDataType) {
      throw Error(`${el.path}: '${el.type}' specified for elDatatype '${elDataType}'`);
    }
  }

  // prettier-ignore
  private _renderElement(
    container: HTMLElement,
    el: SettingElement<T> | SettingGroup<T>,
    groupMember = false
  ) {
    if (el.showIf === false) return;

    const entry = rendererRegistry[el.type];
    if (!entry) {
      console.warn(`No renderer found for type: ${el.type}`);
      return;
    }

    if ('path' in el) {
      try {
        this._checkConsistency(el, 'Numberfield', 'number');
        this._checkConsistency(el, 'Toggle', 'boolean');
      } catch (e) {
        console.error(e);
      }
    }

    let renderer: AbstractBaseRenderer<T> | AbstractPathRenderer<T> | AbstractGroupRenderer<T> | RadioGroupRenderer<T>;

    if (entry.type === 'base') {
      renderer = new entry.ctor(el as BaseSetting);
    } else if (entry.type === 'path') {
      renderer = new entry.ctor(el as PathSetting<T>);
    } else if (entry.type === 'group') {
      renderer = new entry.ctor(el as GroupSetting<T>);
    } else if (entry.type === 'radio') {
      renderer = new entry.ctor(el as RadioGroup<T>);
    } else {
      throw Error(`unknown renderer type ${el.type}`);
    }
    renderer.render(container, groupMember);
  }
}
