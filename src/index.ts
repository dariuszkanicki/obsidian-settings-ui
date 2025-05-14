// index.ts
import type { App, Plugin } from 'obsidian';
import { Renderer } from './renderer/renderer.js';
import { SettingsConfig } from './renderer/types.js';
import { injectPrefixedStyles } from './utils/inject-styles.js';

// 🔹 Entrypoints

export async function renderSettings<T>(
  app: App,
  plugin: Plugin,
  config: SettingsConfig<T>,
  settings: T,
  defaults: T,
  container: HTMLElement,
  saveData: (settings: T) => Promise<void>,
  refreshSettings: () => Promise<void>,
): Promise<void> {
  const renderer = new Renderer(app, plugin, config, settings, defaults, container, saveData, refreshSettings);
  return renderer.renderSettings();
}

export { injectPrefixedStyles };
