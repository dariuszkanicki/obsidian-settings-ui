import type { App, Plugin } from 'obsidian';
import { BaseSetting, PathSetting } from './types.js';

/**
 * Button setting
 */
export type Button = BaseSetting & {
  type: 'Button';
  buttonText?: string;
  onClick: () => void;
};
export type Color<T> = PathSetting<T> & {
  type: 'Color';
  datatype?: 'RGB' | 'string' | 'Hex';
  preview?: () => string;
};
export type ColorDropdown<T> = PathSetting<T> & {
  type: 'ColorDropdown';
  datatype?: 'RGB' | 'string' | 'Hex'; // ⭐ 'Hex' is default
  withCustomOption?: boolean;
  items: DropdownItem[];
};
export type Conditional<T> = {
  type: 'Conditional';
  showIf: boolean;
  items: SettingElement<T>[];
};
export type ConfigContext<T> = {
  app: App;
  plugin: Plugin;
  pluginId: string;
  settings: T;
  defaults: T;
  container: HTMLElement;
  saveData: (settings: T) => Promise<void>;
  refreshSettings: () => Promise<void>;
  localizedSettingMap: Map<string, LocalizedSetting> | null;
};
export type Dropdown<T> = PathSetting<T> & {
  type: 'Dropdown';
  items: DropdownItem[] | string[];
};
export type DropdownItem = {
  id: string;
  label?: string;
};
export type HowToSection = {
  id: string;
  label?: string;
  description: string;
  readmeURL?: string;
  classes?: HowToSectionClasses;
  replacements?: () => Replacement[];
};
export type HowToSectionClasses = {
  wrapper?: string;
  title?: string;
  description?: string;
};
export type LocalizedSetting = {
  id: string;
  label?: string;
  hint?: string;
  tooltip?: string[];
  buttonText?: string;
  text?: string;
  invalid?: string;
};
export type NumberConstraint = {
  min?: number;
  max?: number;
  unit?: string;
};
export type Numberfield<T> = PathSetting<T> & {
  type: 'Numberfield';
  constraint?: NumberConstraint;
  unit?: string;
  min?: number;
  max?: number;
};
export type Password<T> = PathSetting<T> & {
  type: 'Password';
};
export type RadioGroup<T> = PathSetting<T> & {
  type: 'RadioGroup';
  items: RadioItem[];
  postSave?: () => void;
  defaultId?: string;
};
export type RadioItem = BaseSetting & {
  id: string;
};
export type Replacement = {
  name: string;
  text: string;
  aha?: string;
};
export type SettingsConfig<T> = {
  howTo?: HowToSection;
  elements: Array<SettingElement<T> | SettingGroup<T>>;
};

// prettier-ignore
export type SettingElement<T> =
  Button |
  Color<T> |
  ColorDropdown<T> |
  Conditional<T> |
  Dropdown<T> |
  Numberfield<T> |
  Password<T> |
  RadioGroup<T> |
  Status |
  Textarea<T> |
  Textfield<T> |
  Toggle<T>;

// TODO SettingGroup vs. GroupSetting, replace GroupSetting
export type SettingGroup<T> = {
  type: 'SettingGroup';
  id: string;
  label?: string;
  replacements?: () => Replacement[];
  tooltip?: string[];
  showIf?: boolean;
  items: SettingElement<T>[];
};
export type GroupSetting<T> = {
  type: string;
  items: SettingElement<T>[];
  id?: string;
  label?: string;
  showIf?: boolean;
};

export type SettingHandler = {
  setValue: (value: any) => void | Promise<void>;
  getValue: () => number | string | boolean | Promise<number | string | boolean>;
};
export type Status = BaseSetting & {
  type: 'Status';
  items: StatusField[];
};
export type StatusField = {
  text: string;
  isEnabled?: boolean;
  customClass?: () => string;
};
export type Textarea<T> = PathSetting<T> & {
  type: 'Textarea';
  validate?: (value: any) => { valid: boolean; data?: any; invalid?: string; preview?: string };
};
export type Textfield<T> = PathSetting<T> & {
  type: 'Textfield';
  validate?: (value: any) => { valid: boolean; data?: any; invalid?: string; preview?: string };
};
export type Toggle<T> = PathSetting<T> & {
  type: 'Toggle';
};
