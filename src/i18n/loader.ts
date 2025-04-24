import { LocalizedSetting } from '../renderer/types'; // adjust path accordingly
import { getLocalStorage } from '../utils/helper';
import { ContextService } from '../utils/context-service';

export async function loadLocalizedSettings(): Promise<Map<string, LocalizedSetting>> {
  const lang = getLocalStorage('#lang') ?? 'en';
  const path = `.obsidian/plugins/${ContextService.pluginId()}/settings-${lang}.json`;
  const raw = await ContextService.app().vault.adapter.read(path);
  const array: LocalizedSetting[] = JSON.parse(raw);

  return new Map(array.map((item) => [item.id, item]));
}
export async function saveMap() {
  const array = [...ContextService.settingsMap().values()];
  const json = JSON.stringify(array, null, 2); // Pretty-print with 2 spaces
  const lang = getLocalStorage('#lang') ?? 'en';
  const path = `.obsidian/plugins/${ContextService.pluginId()}/settings-${lang}.json`;
  await ContextService.app().vault.adapter.write(path, json);
}
