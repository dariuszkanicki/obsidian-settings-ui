import { ContextService } from './context-service.js';

// global for all Settings controlled by this lib
export function setDefaultSettingFontSize(): void {
  localStorage.setItem(_key('settings-font-size'), '14');
}
export function setSettingFontSize(size: number): void {
  localStorage.setItem(_key('settings-font-size'), String(size));
}
export function getSettingFontSize(): number | undefined {
  const val = localStorage.getItem(_key('settings-font-size'));
  return val ? Number(val) : undefined;
}

export function setCurrentLanguage(lang: string): void {
  localStorage.setItem(_key('lang'), lang);
}
export function getCurrentLanguage(): string {
  return localStorage.getItem(_key('lang')) ?? 'en';
}

export function setGearSlideout(status: string): void {
  localStorage.setItem(_key('gearSlideout'), status);
}
export function getGearSlideout(): string {
  return localStorage.getItem(_key('gearSlideout')) ?? 'closed';
}

// ==============================
// plugin-specific for all vaults
export function setCustomOption(name: string, chosen: boolean): void {
  localStorage.setItem(_pluginKey(name), String(chosen));
}
export function isCustomOptionChosen(name: string) {
  const chosen = localStorage.getItem(_pluginKey(name));
  return chosen === 'true';
}

export function setSettingLabelWidth(width: number): void {
  localStorage.setItem(_pluginKey('label-width'), String(width));
}
export function getSettingLabelWidth(): number | undefined {
  const val = localStorage.getItem(_pluginKey('label-width'));
  return val ? Number(val) : undefined;
}

export function setSettingGroupExpanded(group: string, state: boolean): void {
  localStorage.setItem(_pluginKey(`groupExpanded__${group}`), String(state));
}
export function isSettingGroupExpanded(group: string): boolean {
  const val = localStorage.getItem(_pluginKey(`groupExpanded__${group}`)) ?? 'true';
  return val === 'true';
}

function _pluginKey(suffix: string) {
  return `${ContextService.pluginId()}-dkani-ui:${suffix}`;
}
function _key(suffix: string) {
  return `dkani-ui:${suffix}`;
}
