// index.ts
import { Renderer } from './renderer';
import type { Path, ValueAtPath } from './path';

export type BaseSettingElement<T extends Record<string, any>> = {
  label?: string;
  path?: Path<T>;
  handler?: SettingHandler;
  desc?: string;
  hint?: string;
  customItemClass?: string;
  postSave?: () => void;
  preSave?: (value: any) => void;
  showIf?: boolean;
};
export type Button<T extends Record<string, any>> = BaseSettingElement<T> & {
  type: 'Button';
  onClick: () => void;
};
export type Dropdown<T extends Record<string, any>> = BaseSettingElement<T> & {
  type: 'Dropdown';
  items: DropdownItem[];
  customInputClass?: string;
};
export type Status<T extends Record<string, any>> = BaseSettingElement<T> & {
  type: 'Status';
  items: StatusField[];
};
export type Textfield<T extends Record<string, any>> = BaseSettingElement<T> & {
  type: 'Textfield';
  asTextarea?: boolean;
  placeholder?: string;
  customInputClass?: string;
};
export type Toggle<T extends Record<string, any>> = BaseSettingElement<T> & {
  type: 'Toggle';
};

export type Context<T> = {
  pluginId: string;
  settings: T;
  container: HTMLElement;
  saveData: (settings: T) => Promise<void>;
};
export type DropdownItem = {
  display: string;
  value: string;
};
export type HowToSectionConfig = {
  title?: string;
  description: string;
  readmeURL?: string;
  classes?: {
    wrapper?: string;
    title?: string;
    description?: string;
  };
};
// Anything that can go in a group or top-level
export type SettingElement<T extends Record<string, any>> =
  | Button<T>
  | Dropdown<T>
  | Status<T>
  | Textfield<T>
  | Toggle<T>;

// A group that contains a list of setting elements and/or status blocks
export type SettingGroup<T extends Record<string, any>> = {
  type: 'SettingGroup';
  label: string;
  items: SettingElement<T>[];
};

export type SettingHandler = {
  setValue: (value: any) => void;
  getValue: () => any;
};
export type SettingsSectionConfig<T extends Record<string, any>> = {
  howTo?: HowToSectionConfig;
  elements: Array<SettingElement<T> | SettingGroup<T>>;
};

// Visual-only status label with pills
export type StatusField = {
  text: string;
  isEnabled?: boolean;
  customClass?: () => string;
};

export function renderSettings<T extends Record<string, any>>(
  pluginId: string,
  config: SettingsSectionConfig<T>,
  settings: T,
  container: HTMLElement,
  saveData: (settings: T) => Promise<void>
) {
  const renderer = new Renderer(pluginId, config, settings, container, saveData);
  renderer.renderSettings();
}
