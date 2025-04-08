// index.ts
import { Renderer } from "./src/renderer";

// Individual setting field
export interface SettingElement<K extends keyof any> {
  name: string;
  item: K;
  desc?: string;
  hint?: string;
  placeholder?: string;
  customItemClass?: string;
  customInputClass?: string;
  postSave?: () => void;
}

// Visual-only status label with pills
export interface StatusField {
  text: string;
  color?: string;
  textColor?: string;
}

export interface StatusGroup {
  type: "status";
  title: string;
  items: StatusField[];
}

// How-to box section
export interface HowToSectionConfig {
  title?: string;
  description: string;
  readmeURL?: string;
  classes?: {
    wrapper?: string;
    title?: string;
    description?: string;
  };
}

// A group that contains a list of setting elements and/or status blocks
export interface SettingsGroup<T extends Record<string, any>> {
  type: "group";
  title: string;
  items: SettingsElement<T>[];
}

// Anything that can go in a group or top-level
export type SettingsElement<T extends Record<string, any>> =
  | SettingElement<keyof T>
  | StatusGroup;

export interface SettingsSectionConfig<T extends Record<string, any>> {
  howTo?: HowToSectionConfig;
  elements: Array<SettingsElement<T> | SettingsGroup<T>>;
}


export function renderSettings<T extends Record<string, any>>(
  pluginId:  string,
  config: SettingsSectionConfig<T>,
  settings: T,
  container: HTMLElement,
  saveData: (settings: T) => Promise<void>
) {

  const renderer = new Renderer(pluginId, config, settings, container, saveData );
  renderer.renderSettings();
}




