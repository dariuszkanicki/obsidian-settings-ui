import type { App, Plugin } from 'obsidian';

// Limit recursion depth to 3
type PrevDepth = [never, 0, 1, 2]; // used to decrement depth

// export type Path<T, D extends number = 3> = [D] extends [never]
//   ? never
//   : {
//       [K in keyof T & string]: T[K] extends object ? K | `${K}.${Path<T[K], PrevDepth[D]>}` : K;
//     }[keyof T & string];

// If settings contain arrays, filter them out or explicitly ignore them
export type Path<T, D extends number = 3> = [D] extends [never]
  ? never
  : {
      [K in keyof T & string]: T[K] extends object ? (T[K] extends any[] ? never : K | `${K}.${Path<T[K], PrevDepth[D]>}`) : K;
    }[keyof T & string];

export interface LocalizedSetting {
  id: string;
  label?: string;
  hint?: string;
  tooltip?: string[];
  buttonText?: string;
  text?: string;
  invalid?: string;
}

export type Replacement = {
  name: string;
  text: string;
};

export interface CommonProperties {
  type?: string;
  label?: string;
  hint?: string;
  tooltip?: string[];
  replacements?: () => Replacement[];
  customItemClass?: string;
  showIf?: boolean | (() => boolean);
  disabled?: boolean;
  withoutLabel?: boolean;
}

// 🔹Base for all setting types
export interface BaseSetting extends CommonProperties {
  id: string;
}

export interface PathSettingWithPath<T> extends CommonProperties {
  path: Path<T>;
  handler?: never; // ⛔️ disallow if path is used
  id?: never; // ⛔️ disallow if path is used
  placeholder?: string | number;
  customInputClass?: string;
  preSave?: (value: any) => void | Promise<void>;
  postSave?: () => void;
}

export interface PathSettingWithHandlerBase extends CommonProperties {
  handler: SettingHandler;
  // id: string; // ✅ required when handler is present
  path?: never; // ⛔️ disallow if handler is used
  placeholder?: string | number;
  customInputClass?: string;
  preSave?: (value: any) => void | Promise<void>;
  postSave?: () => void;
}

export interface HandlerOnlyLabel extends PathSettingWithHandlerBase {
  id?: never;
  label: string;
}

// When using a handler, if you do supply an id then the label is optional.
export interface HandlerWithId extends PathSettingWithHandlerBase {
  id: string;
  label?: string;
}

// 🔹additionally for settings that store values (e.g., in your plugin's settings object)
export type PathSetting<T> = PathSettingWithPath<T> | HandlerOnlyLabel | HandlerWithId;

export interface Conditional<T> {
  type: 'Conditional';
  showIf: boolean;
  items: SettingElement<T>[];
}

export interface Button extends BaseSetting {
  type: 'Button';
  buttonText?: string;
  onClick: () => void;
}
export interface Status extends BaseSetting {
  type: 'Status';
  items: StatusField[];
}
export type RadioGroup<T> = PathSetting<T> & {
  type: 'RadioGroup';
  items: RadioItem[];
  postSave?: () => void;
  defaultId?: string;
};
export interface RadioItem extends BaseSetting {
  id: string;
}

export type Textfield<T> = PathSetting<T> & {
  type: 'Textfield';
  validate?: (value: any) => { valid: boolean; data?: any; invalid?: string; preview?: string };
};
export type Password<T> = PathSetting<T> & {
  type: 'Password';
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
export type Textarea<T> = PathSetting<T> & {
  type: 'Textarea';
  validate?: (value: any) => { valid: boolean; data?: any; invalid?: string; preview?: string };
};
export type Toggle<T> = PathSetting<T> & {
  type: 'Toggle';
};

export type Color<T> = PathSetting<T> & {
  type: 'Color';
  datatype?: 'RGB' | 'string' | 'Hex';
  preview?: () => string;
};

export type ColorDropdown<T> = PathSetting<T> & {
  type: 'ColorDropdown';
  datatype?: 'RGB' | 'string' | 'Hex'; // 'Hex' is default
  withCustomOption?: boolean;
  items: DropdownItem[];
};
export type Dropdown<T> = PathSetting<T> & {
  type: 'Dropdown';
  items: DropdownItem[] | string[];
};

// 🔸 Shared status object for read-only status badges
export type StatusField = {
  text: string;
  isEnabled?: boolean;
  customClass?: () => string;
};

// 🔹 Dropdown option item
export type DropdownItem = {
  id: string;
  label?: string;
};

export type HowToSectionClasses = {
  wrapper?: string;
  title?: string;
  description?: string;
};

// 🔹 How-to support section
export type HowToSection = {
  id: string;
  label?: string;
  description: string;
  readmeURL?: string;
  classes?: HowToSectionClasses;
  replacements?: () => Replacement[];
};

// 🔹 Top-level or group-level setting items (generic)
// prettier-ignore
export type SettingElement<T> =
  Button |
  Status |
  RadioGroup<T> |
  Conditional<T> |
  Dropdown<T> |
  ColorDropdown<T> |
  Textfield<T> |
  Password<T> |
  Numberfield<T> |
  Textarea<T> |
  Toggle<T> |
  Color<T>;

// TODO SettingGroup vs. GroupSetting, replace GroupSetting

// 🔹 Groups of settings
export type SettingGroup<T> = {
  type: 'SettingGroup';
  id: string;
  label?: string;
  replacements?: () => Replacement[];
  tooltip?: string[];
  showIf?: boolean;
  items: SettingElement<T>[];
};

// 🔹Base for all setting types
export interface GroupSetting<T> {
  type: string;
  items: SettingElement<T>[];
  id?: string;
  label?: string;
  showIf?: boolean;
}

// 🔹Section definition
export type SettingsConfig<T> = {
  howTo?: HowToSection;
  elements: Array<SettingElement<T> | SettingGroup<T>>;
};

// 🔹Context passed around to path renderers
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

export type SettingHandler = {
  setValue: (value: any) => void | Promise<void>;
  getValue: () => number | string | boolean | Promise<number | string | boolean>;
};
