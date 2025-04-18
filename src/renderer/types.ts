// 🔹Base for all setting types
export interface BaseSetting {
  type: string;
  label: string;
  desc?: string;
  hint?: string;
  customItemClass?: string;
  showIf?: boolean;
}

// 🔹additionally for settings that store values (e.g., in your plugin's settings object)
export interface PersistentSetting<T extends Record<string, any>> {
  path: string;
  handler?: SettingHandler;
  preSave?: (value: any) => void;
  postSave?: () => void;
}

export interface PathSetting<T> extends BaseSetting, PersistentSetting<T> {}

export interface Button extends BaseSetting {
  type: 'Button';
  onClick: () => void;
}
export interface Status extends BaseSetting {
  type: 'Status';
  items: StatusField[];
}

export interface Textfield<T extends Record<string, any>> extends PathSetting<T> {
  type: 'Textfield';
  asTextarea?: boolean;
  placeholder?: string;
  customInputClass?: string;
}
export interface Toggle<T extends Record<string, any>> extends PathSetting<T> {
  type: 'Toggle';
}
export interface Dropdown<T extends Record<string, any>> extends PathSetting<T> {
  type: 'Dropdown';
  items: DropdownItem[];
  customInputClass?: string;
}

// 🔸 Shared status object for read-only status badges
export type StatusField = {
  text: string;
  isEnabled?: boolean;
  customClass?: () => string;
};

// 🔹 Dropdown option item
export type DropdownItem = {
  display: string;
  value: string;
};

// 🔹 How-to support section
export type HowToSection = {
  label?: string;
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
export type SettingElement<T extends Record<string, any>> = 
    Button          | 
    Status          | 
    Dropdown<T>     | 
    Textfield<T>    | 
    Toggle<T>;

// 🔹 Groups of settings
export type SettingGroup<T extends Record<string, any>> = {
  type: 'SettingGroup';
  label: string;
  items: SettingElement<T>[];
};

// 🔹Section definition
export type SettingsConfig<T extends Record<string, any>> = {
  howTo?: HowToSection;
  elements: Array<SettingElement<T> | SettingGroup<T>>;
};

// 🔹Context passed around to path renderers
export type ConfigContext<T extends Record<string, any>> = {
  pluginId: string;
  settings: T;
  saveData: (settings: T) => Promise<void>;
};

// 🔹Shared setting handler interface
export type SettingHandler = {
  setValue: (value: any) => void;
  getValue: () => any;
};
