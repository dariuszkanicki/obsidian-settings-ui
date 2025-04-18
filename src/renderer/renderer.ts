import { rendererRegistry } from './registry';
import { AbstractBaseRenderer } from './abstract-base-renderer';
import { AbstractPathRenderer } from './abstract-path-renderer';
import { ConfigContext, SettingsConfig, SettingElement, BaseSetting, PathSetting } from './types';
import { GroupRenderer } from './group-renderer';
import { renderHowToSection } from './howto-renderer';

export class Renderer<T extends Record<string, any>> {
  private context: ConfigContext<T>;

  constructor(
    private pluginId: string,
    private config: SettingsConfig<T>,
    private settings: T,
    private container: HTMLElement,
    private saveData: (settings: T) => Promise<void>
  ) {
    this.context = {
      pluginId: this.pluginId,
      settings: this.settings,
      saveData: this.saveData,
    };
  }

  renderSettings() {
    this.container.empty();

    const groupRenderer = new GroupRenderer(this.pluginId, this.container);

    if (this.config.howTo) {
      const label = this.config.howTo.label ?? 'How to use this plugin';
      const howtoEl = groupRenderer.render(label);
      renderHowToSection(howtoEl, this.pluginId, this.config.howTo);
    }

    for (const el of this.config.elements) {
      if ('type' in el && el.type === 'SettingGroup') {
        const bodyEl = groupRenderer.render(el.label);
        el.items.forEach((item) => this._renderElement(bodyEl, item, true));
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

    let renderer: AbstractBaseRenderer | AbstractPathRenderer<unknown>;

    if (entry.type === 'base') {
      // Base renderers expect (pluginId, element)
      renderer = new entry.ctor(this.pluginId, el as BaseSetting);
    } else if (entry.type === 'path') {
      // Path renderers expect (context, element)
      const context: ConfigContext<T> = {
        pluginId: this.pluginId,
        settings: this.settings,
        saveData: this.saveData,
      };
      renderer = new entry.ctor(context, el as PathSetting<T>);
    }
    renderer.render(container, groupMember);
  }
}
