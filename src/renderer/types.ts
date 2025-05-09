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
  label?: string | string[];
  hint?: string;
  tooltip?: string[];
  buttonText?: string;
  text?: string;
  invalid?: string;
}

// 🔹Base for all setting types
export interface BaseSetting {
  type?: string;
  id?: string;
  label?: string;
  labelParameters?: string[];
  hint?: string;
  hintParameters?: string[];
  tooltip?: string[];
  tooltipParameters?: string[];
  customItemClass?: string;
  showIf?: boolean;
  disabled?: boolean;
}

// 🔹additionally for settings that store values (e.g., in your plugin's settings object)
export interface PathSetting<T> extends BaseSetting {
  path?: Path<T>;
  handler?: SettingHandler;
  placeholder?: string | number;
  customInputClass?: string;
  preSave?: (value: any) => void;
  postSave?: () => void;
}

// 🔹Base for all setting types
export interface GroupSetting<T> {
  type: string;
  items: SettingElement<T>[];
  id?: string;
  label?: string;
  labelParameters?: string[];
  showIf?: boolean;
}

export interface Conditional<T> {
  type: 'Conditional';
  showIf: boolean;
  items: SettingElement<T>[];
}

// export interface PathSetting<T> extends BaseSetting, PersistentSetting<T> {}

export interface Button extends BaseSetting {
  type: 'Button';
  buttonText?: string;
  onClick: () => void;
}
export interface Status extends BaseSetting {
  type: 'Status';
  items: StatusField[];
}
export interface RadioGroup<T> extends PathSetting<T> {
  type: 'RadioGroup';
  items: RadioItem[];
  postSave?: () => void;
  defaultId?: string;
}
export interface RadioItem extends BaseSetting {
  // type: 'RadioItem';
  id: string;
  // radioCallback?: (path: string, value: boolean) => void;
}

export interface Textfield<T> extends PathSetting<T> {
  type: 'Textfield';
  validate?: (value: any) => { valid: boolean; data?: any; invalid?: string; preview?: string };
}
export interface Password<T> extends PathSetting<T> {
  type: 'Password';
}

export type NumberConstraint = {
  min?: number;
  max?: number;
  unit?: string;
};

export interface Numberfield<T> extends PathSetting<T> {
  type: 'Numberfield';
  constraint?: NumberConstraint;
  unit?: string;
  min?: number;
  max?: number;
}
export interface Textarea<T> extends PathSetting<T> {
  type: 'Textarea';
  validate?: (value: any) => { valid: boolean; data?: any; invalid?: string; preview?: string };
}
export interface Toggle<T> extends PathSetting<T> {
  type: 'Toggle';
}
export interface Color<T> extends PathSetting<T> {
  type: 'Color';
  datatype?: 'RGB' | 'string' | 'Hex';
  preview?: () => string;
}

export interface ColorDropdown<T> extends PathSetting<T> {
  type: 'ColorDropdown';
  datatype?: 'RGB' | 'string' | 'Hex'; // 'Hex' is default
  withCustomOption?: boolean;
  items: DropdownItem[];
}
export interface Dropdown<T> extends PathSetting<T> {
  type: 'Dropdown';
  items: DropdownItem[] | string[];
}

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

// 🔹 How-to support section
export type HowToSection = {
  id?: string;
  label?: string;
  currentLabelIndex?: number;
  labelParameters?: string[];
  description: string;
  readmeURL?: string;
  classes?: {
    wrapper?: string;
    title?: string;
    description?: string;
  };
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

// 🔹 Groups of settings
export type SettingGroup<T> = {
  type: 'SettingGroup';
  id?: string;
  currentLabelIndex?: number;
  label?: string;
  labelParameters?: string[];
  tooltip?: string[];
  showIf?: boolean;
  items: SettingElement<T>[];
};

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
  settingsMap: Map<string, LocalizedSetting> | null;
};

export type SettingHandler = {
  setValue: (value: number | string | boolean | null) => void | Promise<void>;
  getValue: () => number | string | boolean | Promise<number | string | boolean>;
};
