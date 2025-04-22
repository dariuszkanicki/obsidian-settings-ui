import { App, Plugin } from 'obsidian';
import { Renderer } from './renderer/renderer';
import { SettingsConfig } from './renderer/types';

// 🔹 Entrypoint
export async function renderSettings<T extends Record<string, any>>(
  app: App,
  plugin: Plugin,
  config: SettingsConfig<T>,
  settings: T,
  container: HTMLElement,
  saveData: (settings: T) => Promise<void>,
  refreshSettings: () => Promise<void>
) {
  const renderer = new Renderer(app, plugin, config, settings, container, saveData, refreshSettings);
  await renderer.renderSettings();
}
