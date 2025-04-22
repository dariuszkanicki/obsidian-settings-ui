import { App, Plugin } from 'obsidian';
import { LocalizedSetting } from '../renderer/types'; // adjust path accordingly
import { css } from '../utils/helper';
import * as fs from 'fs/promises';
import * as path from 'path';

export async function loadLocalizedSettings(plugin: Plugin): Promise<Map<string, LocalizedSetting>> {
  const lang = getLocalStorage(plugin, 'lang') ?? 'en';
  const path = `.obsidian/plugins/${plugin.manifest.id}/settings-${lang}.json`;
  const raw = await plugin.app.vault.adapter.read(path);
  const array: LocalizedSetting[] = JSON.parse(raw);

  return new Map(array.map((item) => [item.id, item]));
}
export async function saveMap(plugin: Plugin, map: Map<string, LocalizedSetting>) {
  const array = [...map.values()];
  const json = JSON.stringify(array, null, 2); // Pretty-print with 2 spaces
  const lang = getLocalStorage(plugin, 'lang') ?? 'en';
  const path = `.obsidian/plugins/${plugin.manifest.id}/settings-${lang}.json`;
  await plugin.app.vault.adapter.write(path, json);
}

export function getLocalStorage(plugin: Plugin, key: string) {
  return plugin.app.loadLocalStorage(css(plugin.manifest.id, key));
}
export function setLocalStorage(plugin: Plugin, key: string, value: string) {
  return plugin.app.saveLocalStorage(css(plugin.manifest.id, key), value);
}
