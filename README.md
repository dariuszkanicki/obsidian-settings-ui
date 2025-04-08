# Obsidian Settings UI

A lightweight helper library for building consistent, grouped, and dynamic settings UIs in [Obsidian](https://obsidian.md) plugins.

## ✨ Features

- ✅ Automatically renders settings UI based on SettingsSectionConfig interface definition
- ✅ Type-safe with your plugin’s `Settings` interface
- ✅ Supports text, toggle, and number input
- ✅ Supports grouped sections
- ✅ Optional “How to use” section
- ✅ Automatic binding to your plugin's settings object

## 📦 Installation

In your plugin project:

```bash
pnpm install @dkani/obsidian-settings-ui
pnpm install --save-dev postcss postcss-prefix-selector postcss-cli

```

## 🧱 Basic Usage

### 1. Define your plugin `Settings` interface and the corresponding `SettingsSectionConfig`

```ts
// setting.ts
import { SettingsSectionConfig } from "@dkani/obsidian-settings-ui";

export interface Settings {
  setting1: string;
  setting2: number;
  setting3: boolean;
  option1: boolean;
  option2: boolean;
  logToConsole: boolean;
}

export const settingsConfig: SettingsSectionConfig<Settings> = {
  howTo: {
    description: `
      here the description of your plugin ...
    `,
    readmeURL: "https://github.com/.../<pluginName>/.../README.md"
  },
  elements: [
    { name: "Label1", item: "setting1", placeholder: "enter whatever" },
    { name: "Label2", item: "setting2", placeholder: "enter number of ..." },
    { name: "Label3", item: "setting3" },
    {
      type: "group",
      title: "Options",
      items: [
        { name: "Label for option1", item: "option1" },
        { name: "Label for option2", item: "option2" },
      ]
    }
  ]
};
```

### 2. Render inside your `PluginSettingTab`

```ts
// settings-tab.ts
import { Settings, settingsConfig } from "./settings";
import { renderSettings } from "@dkani/obsidian-settings-ui";

export class MyPluginSettingTab extends PluginSettingTab {
  plugin: GitHubSyncPlugin;
  settings: Settings;
    
  constructor(app: App, plugin: GitHubSyncPlugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.settings = plugin.settings;
  }

  display(): void {
    const { containerEl } = this;
    renderSettings(
      settingsConfig,
      this.settings,
      containerEl,
      async (newSettings: Settings) => {
        await this.plugin.saveData(newSettings);
      }
    );        
  }
}
```

### 3. Add the `MyPluginSettingTab` into your plugin

```ts
// main.ts

import { MyPluginSettingTab } from "./settings-tab";

export default class MyPlugin extends Plugin {
...
  async onload() {
    this.addSettingTab(new MyPluginSettingTab(this));
  }
...
}  
```

## 🎨 Styling

Copy `styles.css` content into your plugin’s `styles.css`.

## 📜 License

MIT — use freely, modify, and contribute back!

Made with ❤️ for Obsidian developers.