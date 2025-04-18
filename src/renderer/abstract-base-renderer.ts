import { Setting } from 'obsidian';
import { BaseSetting } from './types';
import { addCodeHighlightedText, css } from '../utils/helper';

export abstract class AbstractBaseRenderer {
  constructor(private pluginId: string, private element: BaseSetting) {}

  // prettier-ignore
  render(
    container: HTMLElement, 
    groupMember: boolean
  ): void {
    const setting = createSetting(this.pluginId, this.element, container, groupMember);
    this.createElement(this.pluginId, setting, this.element);
  }
  protected abstract createElement(pluginId: string, setting: Setting, element: BaseSetting): void;
}

// prettier-ignore
export function createSetting(
  pluginId:     string, 
  element:      BaseSetting, 
  container:    HTMLElement, 
  groupMember:  boolean
): Setting {

  const setting = new Setting(container);
  if (element.label) {
    addCodeHighlightedText(setting.nameEl, pluginId, element.label);
  }
  setting.settingEl.addClass(css(pluginId, groupMember ? 'dkani-ui-group-item' : 'dkani-ui-item'));
  return setting;
}
