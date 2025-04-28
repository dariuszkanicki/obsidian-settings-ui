import { loadLocalizedSettings } from "../i18n/loader";
import type { ConfigContext } from "../renderer/types";

export class ContextService<T> {
  private static instance: any;

  private constructor(private context: ConfigContext<T>) {}

  static get<T>(): ContextService<T> {
    if (!ContextService.instance) {
      throw new Error();
    }
    return ContextService.instance;
  }

  static initialize<T>(context: ConfigContext<T>): void {
    this.instance = new ContextService(context);
  }

  static settingsMap() {
    return this.instance.context.settingsMap;
  }
  static settings<T>(): T {
    return this.instance.context.settings;
  }
  static async saveData<T>(settings: T) {
    this.instance.context.saveData(settings);
  }

  static pluginId() {
    return this.instance.context.pluginId;
  }
  static app() {
    return this.instance.context.app;
  }
  static refreshSettings() {
    this.instance.context.refreshSettings();
  }
}
