import type { LocalizedSetting } from '../renderer/types-api.js';
import { ContextService } from '../utils/context-service.js';
import { getCurrentLanguage } from '../utils/storage.js';

export async function loadLocalizedSettings(): Promise<Map<string, LocalizedSetting>> {
  const lang = getCurrentLanguage();
  const path = `.obsidian/plugins/${ContextService.pluginId()}/settings-${lang}.json`;

  try {
    const raw = await ContextService.app().vault.adapter.read(path);
    const array: LocalizedSetting[] = JSON.parse(raw);
    return new Map(array.map((item) => [item.id, item]));
  } catch (error) {
    console.warn(`Could not load localized settings for language "${lang}":`, error);
    return new Map();
  }

  // const raw = await ContextService.app().vault.adapter.read(path);
  // const array: LocalizedSetting[] = JSON.parse(raw);

  // return new Map(array.map((item) => [item.id, item]));
}
export async function saveMap() {
  const array = [...ContextService.localizedSettingMap()!.values()];
  const json = JSON.stringify(array, null, 2); // Pretty-print with 2 spaces
  const lang = getCurrentLanguage();
  const path = `.obsidian/plugins/${ContextService.pluginId()}/settings-${lang}.json`;
  await ContextService.app().vault.adapter.write(path, json);
}
