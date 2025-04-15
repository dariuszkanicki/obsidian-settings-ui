import { Setting } from 'obsidian';
import { Helper } from '../helper';
import { Context } from '..';

export abstract class AbstractElement<T extends Record<string, any>> {
  protected helper: Helper<Record<string, any>>;
  protected setting: Setting;

  constructor(
    protected context: Context<T>,
    private label: string,
    private groupMember: boolean
  ) {
    this.helper = new Helper(this.context.pluginId);
  }

  render(): void {
    this.setting = this._createSetting();
    this.renderClassSpecific();
  }

  protected abstract renderClassSpecific(): void;

  private _createSetting() {
    const setting = new Setting(this.context.container);
    if (this.label) {
      this.helper.setParsedName(setting.nameEl, this.label);
    }
    setting.settingEl.addClass(
      this.helper.css(
        this.groupMember ? 'dkani-ui-group-item' : 'dkani-ui-item'
      )
    );
    return setting;
  }
}
