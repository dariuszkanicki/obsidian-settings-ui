import type { App, Plugin, PluginSettingTab } from 'obsidian';
import type { BaseSetting, PathSetting } from './types.js';

/**
 * Obsidian 'Button' element.
 * This element doesn't have label.
 * You have to specify either 'buttonText' or 'id' if you're using localization.
 *
 */
export type Button = BaseSetting & {
  type: 'Button';
  /**
   * Is mandatory if localization is not used
   */
  buttonText?: string;
  onClick: () => void;
};

/**
| Example                       |  |
|-------------------------------| --- | 
| ![Image](./ColorPicker.png) | display mode |
| ![Image](./ColorPicker2.png) | editing mode |
 */
export type ColorPicker<T> = PathSetting<T> & {
  type: 'ColorPicker';
  datatype?: 'RGB' | 'string' | 'Hex';
  preview?: () => string;
};

/**
The `ColorDropdown` component provides a versatile UI element that combines a color picker, an input field, and a dropdown menu, allowing users to select or input a color value in various formats.

## Usage & Configuration

The following example demonstrates how to configure the `ColorDropdown` component, especially in combination with localization. This showcases how localization can override configuration properties.

In practice, you can either:

** Use configuration alone (if localization is not required), or
** Delegate all language-specific aspects (like labels) to the localization file, keeping the configuration purely structural.

---

### Label Overriding

In the example below:

** The configuration specifies a label: `'My Text Color'`.
** The localization file contains an entry for the same `id: 'lineAuthor.textColorCss'` with a label: `'Text Color'`.

> **Result:** The label from the localization file (`'Text Color'`) overrides the one from the configuration.

Additionally, the localization file includes an entry for a specific dropdown item:<br/>
`id: 'lineAuthor.textColorCss.var(--text-muted)'`.<br/>
This overrides the label for that individual dropdown item only.

Other dropdown items—such as `var(--text-accent)` and `var(--text-faint)`—do not have localized labels, so their `id` values are used as fallback labels.

---

### 📄 Configuration Entry (`setting-config.ts`)

![Image](./ColorDropdownConfig.png)

---

### 🌐 Localization Entry (`setting-en.json`)

This overrides both the dropdown's main label and one of its item labels.

![Image](./ColorDropdownLocalization.png)

---

### 🧩 Rendered Element in Settings Panel

The basic form of the `ColorDropdown`:

![Image](./ColorDropdown1.png)

When the user selects the **Custom** option, the component expands to include a color picker and an input field:

![Image](./ColorDropdown2.png)

This allows users to enter a color value manually or pick one using the visual selector.
 */
export type ColorDropdown<T> = PathSetting<T> & {
  type: 'ColorDropdown';
  /**
   * ⭐ 'Hex' is default
   */
  datatype?: 'RGB' | 'string' | 'Hex';
  /**
   * Adds additional 'custom' option at the end of the list,<br/>
   * which, if selected, display addition colorpicker and an inputfield.<br/>
   * The user can then use those to set the color.
   */
  withCustomOption?: boolean;
  items: DropdownItem[];
};
export type Conditional<T> = {
  type: 'Conditional';
  showIf: boolean;
  items: SettingElement<T>[] | SettingGroup<T>[];
};
export type ConfigContext<T> = {
  app: App;
  plugin: Plugin;
  pluginId: string;
  settings: T;
  defaults: T;
  settingTab: PluginSettingTab;
  // container: HTMLElement;
  // saveData: (settings: T) => Promise<void>;
  // refreshSettings: () => Promise<void>;
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
export type Message = {
  type: 'Message';
  id: string;
  message?: string;
  showIf?: boolean;
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
};
export type SupportSection = {
  kofiId: string;
};

export type SettingsConfig<T> = {
  howTo?: HowToSection;
  elements: Array<SettingElement<T> | SettingGroup<T>>;
  support?: SupportSection;
};

// prettier-ignore
export type SettingElement<T> =
  Button |
  ColorPicker<T> |
  ColorDropdown<T> |
  Conditional<T> |
  Dropdown<T> |
  Message |
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
  getValue: () => any | Promise<any>;
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
  validate?: (value: unknown) => { valid: boolean; data?: unknown; invalid?: string; preview?: string };
};
export type Textfield<T> = PathSetting<T> & {
  type: 'Textfield';
  validate?: (value: unknown) => { valid: boolean; data?: unknown; invalid?: string; preview?: string };
};
export type Toggle<T> = PathSetting<T> & {
  type: 'Toggle';
};
