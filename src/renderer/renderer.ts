import { rendererRegistry } from './registry';
import { AbstractBaseRenderer } from './impl/abstract-base-renderer';
import { AbstractPathRenderer } from './impl/abstract-path-renderer';
import { ConfigContext, SettingsConfig, SettingElement, BaseSetting, PathSetting, LocalizedSetting, GroupSetting, Path } from './types';
import { GroupRenderer } from './impl/group-renderer';
import { renderHowToSection } from './impl/howto-renderer';
import { loadLocalizedSettings } from '../i18n/loader';
import { App, Plugin } from 'obsidian';
import { renderGear } from './gear';
import { AbstractGroupRenderer } from './impl/abstract-group-renderer';
import { ContextService } from '../utils/context-service';

export class Renderer<T> {
  private context: ConfigContext<T>;
  constructor(
    private app: App,
    private plugin: Plugin,
    private config: SettingsConfig<T>,
    private settings: T,
    private container: HTMLElement,
    private saveData: (settings: T) => Promise<void>,
    private refreshSettings: () => Promise<void>
  ) {
    this.context = {
      app: this.app,
      plugin: this.plugin,
      pluginId: this.plugin.manifest.id,
      settings: this.settings,
      saveData: this.saveData,
      refreshSettings: this.refreshSettings,
      settingsMap: null,
    };
  }

  async renderSettings() {
    ContextService.initialize(this.context);
    this.context.settingsMap = await loadLocalizedSettings();
    this.container.empty();

    await renderGear(this.container);

    const groupRenderer = new GroupRenderer(this.container);

    if (this.config.howTo) {
      const label = this.config.howTo.label ?? 'How to use this plugin';
      const howtoEl = groupRenderer.render(label);
      renderHowToSection(howtoEl, this.context.pluginId, this.config.howTo);
    }

    for (const el of this.config.elements) {
      if ('type' in el && el.type === 'SettingGroup') {
        const bodyEl = groupRenderer.render(el.label);
        el.items.forEach((item) => {
          if ('type' in item && item.type === 'Conditional') {
            if (item.showIf === true) {
              item.items.forEach((conditionalItem) => this._renderElement(bodyEl, conditionalItem, true));
            }
          } else {
            this._renderElement(bodyEl, item, true);
          }
        });
      } else {
        this._renderElement(this.container, el);
      }
    }
  }

  // prettier-ignore
  private _renderElement(
    container: HTMLElement, 
    el: SettingElement<T>, 
    groupMember = false
  ) {
    if (el.showIf === false) return;

    const entry = rendererRegistry[el.type];

    if (!entry) {
      console.warn(`No renderer found for type: ${el.type}`);
      return;
    }

    let renderer: AbstractBaseRenderer<T> | AbstractPathRenderer<T> | AbstractGroupRenderer<T>;

    if (entry.type === 'base') {
      renderer = new entry.ctor(el as BaseSetting);
    } else if (entry.type === 'path') {
      renderer = new entry.ctor(el as PathSetting<T>);
    } else if (entry.type === 'group') {
      renderer = new entry.ctor(el as GroupSetting<T>);
    } else {
      throw Error(`unknown renderer type ${el.type}`);
    }
    renderer.render(container, groupMember);
  }
}
