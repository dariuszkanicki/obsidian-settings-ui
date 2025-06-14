import type { ConfigContext } from '../renderer/types-api.js';

export class ContextService<T> {
  private static instance: ContextService<any>;

  private constructor(private context: ConfigContext<T>) {}

  // static get<T>(): ContextService<T> {
  //   if (!ContextService.instance) {
  //     throw new Error();
  //   }
  //   return ContextService.instance;
  // }

  static initialize<T>(context: ConfigContext<T>): void {
    this.instance = new ContextService(context);
  }

  static localizedSettingMap() {
    return this.instance.context.localizedSettingMap;
  }
  static settings<T>(): T {
    return this.instance.context.settings as T;
  }
  static defaults<T>(): T {
    return this.instance.context.defaults as T;
  }

  static async saveData<T>(settings: T) {
    await this.instance.context.plugin.saveData(settings);
  }

  static pluginId() {
    return this.instance.context.pluginId;
  }
  static app() {
    return this.instance.context.app;
  }
  // static async refresh() {
  //   await this.instance.context.refreshSettings();
  // }
  static settingTab() {
    return this.instance.context.settingTab;
  }
}
