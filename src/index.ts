import { Renderer } from './renderer/renderer';
import { SettingsConfig } from './renderer/types';

// 🔹 Entrypoint
export function renderSettings<T extends Record<string, any>>(
  pluginId: string,
  config: SettingsConfig<T>,
  settings: T,
  container: HTMLElement,
  saveData: (settings: T) => Promise<void>
) {
  const renderer = new Renderer(pluginId, config, settings, container, saveData);
  renderer.renderSettings();
}
