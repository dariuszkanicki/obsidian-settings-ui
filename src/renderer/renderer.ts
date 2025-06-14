import type { Plugin, PluginSettingTab } from 'obsidian';
import { loadLocalizedSettings } from '../i18n/loader.js';
import { ContextService } from '../utils/context-service.js';
import { renderGear } from './gear.js';
import type { AbstractBaseRenderer } from './impl/abstract-base-renderer.js';
import type { AbstractGroupRenderer } from './impl/abstract-group-renderer.js';
import type { AbstractPathRenderer } from './impl/abstract-path-renderer.js';
import { GroupRenderer } from './impl/group-renderer.js';
import { renderHowToSection } from './impl/howto-renderer.js';
import { rendererRegistry } from './registry.js';
import type { BaseSetting, PathSetting } from './types.js';
import type { ConfigContext, SettingsConfig, GroupSetting, SettingGroup, SettingElement, Message } from './types-api.js';
import type { RadioGroup } from './types-api.js';
import type { Conditional } from './types-api.js';
import type { RadioGroupRenderer } from './impl/radiogroup-renderer.js';
import { getDefaultValue } from '../utils/value-utils.js';
import { renderSupportSection } from './impl/support-renderer.js';
import type { AbstractRenderer } from './impl/abstract-renderer.js';
import { translateElementPart } from '../utils/translation.js';
import { replaceAndDisplay } from '../utils/setting-utils.js';

export class Renderer<T> {
  private context: ConfigContext<T>;
  private container!: HTMLElement;
  private isRendering = false;

  constructor(
    private plugin: Plugin,
    private settings: T,
    private defaults: T,
    private settingTab: PluginSettingTab,
  ) {
    this.context = {
      app: this.plugin.app,
      plugin: this.plugin,
      pluginId: this.plugin.manifest.id,
      settings: this.settings,
      defaults: this.defaults,
      settingTab: this.settingTab,
      localizedSettingMap: null,
    };
  }

  async display(containerEl: HTMLElement, config: SettingsConfig<T>): Promise<HTMLElement> {
    if (this.isRendering) {
      return containerEl;
    }
    this.isRendering = true;
    const scrollTop = containerEl.scrollTop;
    const currentContainer = containerEl;

    try {
      containerEl = await replaceAndDisplay(
        currentContainer,
        async (newContainer) => {
          await this._renderSettings(newContainer, config);
        },
        scrollTop,
      );
    } finally {
      this.isRendering = false;
      return containerEl;
    }
  }

  private async _renderSettings(container: HTMLElement, config: SettingsConfig<T>): Promise<void> {
    this.container = container;
    ContextService.initialize(this.context);
    this.context.localizedSettingMap = await loadLocalizedSettings();
    container.empty();

    await renderGear(container);

    const groupRenderer = new GroupRenderer(container);

    if (config.howTo) {
      if (!config.howTo.label) {
        config.howTo.label = translateElementPart(config.howTo, 'label') ?? 'How to use this plugin';
      }
      const howtoEl = groupRenderer.render(config.howTo);
      renderHowToSection(howtoEl, this.context.pluginId, config.howTo);
    }
    this._renderElements(config.elements, groupRenderer);
    renderSupportSection(container, config.support);
  }

  private _renderElements(elements: Array<SettingElement<T> | SettingGroup<T>>, groupRenderer: GroupRenderer) {
    for (const el of elements) {
      if (this._isConditional(el)) {
        if (el.showIf === false) {
          continue;
        } else {
          this._renderElements(el.items, groupRenderer);
        }
      } else if (this._isSettingGroup(el) && el.showIf !== false) {
        const bodyEl = groupRenderer.render(el);
        for (const item of el.items) {
          if (this._isConditional(item)) {
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

    let renderer: AbstractBaseRenderer | AbstractPathRenderer<T> | AbstractGroupRenderer<T> | RadioGroupRenderer<T> | AbstractRenderer;

    if (entry.type === 'base') {
      renderer = new entry.ctor(el as BaseSetting);
    } else if (entry.type === 'path') {
      renderer = new entry.ctor(el as PathSetting<T>);
    } else if (entry.type === 'group') {
      renderer = new entry.ctor(el as GroupSetting<T>);
    } else if (entry.type === 'radio') {
      renderer = new entry.ctor(el as RadioGroup<T>);
    } else if (entry.type === 'msg') {
      renderer = new entry.ctor(el as Message);
    } else {
      throw Error(`unknown renderer type ${el.type}`);
    }
    renderer.render(container, groupMember);
  }

  private _isSettingGroup(el: unknown): el is SettingGroup<T> {
    return (
      typeof el === 'object' &&
      el !== null &&
      (el as { type?: string }).type === 'SettingGroup' &&
      Array.isArray((el as { items?: unknown[] }).items)
    );
  }

  private _isConditional(el: unknown): el is Conditional<T> {
    return (
      typeof el === 'object' &&
      el !== null &&
      (el as { type?: string }).type === 'Conditional' &&
      Array.isArray((el as { items?: unknown[] }).items)
    );
  }
}
