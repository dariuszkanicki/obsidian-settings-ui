# Obsidian Settings UI

A lightweight helper library for building consistent, grouped, and dynamic settings UIs in [Obsidian](https://obsidian.md) plugins.

## ✨ Features

- ✅ Automatically renders settings UI based on SettingsConfig interface definition
- ✅ Type-safe with your plugin’s `Settings` interface
- ✅ Supports all obsidian input elements
- ✅ Add new input elements like RadioGroup, ColorPicker, ColorDropdown
- ✅ Supports grouped sections
- ✅ Optional “How to use” section
- ✅ Automatic binding to your plugin's settings object
- ✅ Add localization functionality
- ✅ Add conditional rendering and more ...

## 📦 Installation

In your plugin project:

```bash
pnpm add @dkani/obsidian-settings-ui
```

The library uses many styles to achieve the desired look and feel. To avoid conflicts with other plugins or with Obsidian itself, all styles must be prefixed with the plugin's ID. This is handled by the `inject-prefixed-styles` script. To inject the styles, you first need to install the following packages:

```bash
pnpm add --save-dev tsx postcss postcss-prefix-selector
```

In your `package.json` create a new script entry:

```
"scripts": {
  "inject:styles": "node node_modules/@dkani/obsidian-settings-ui/dist/scripts/inject-prefixed-styles.js",     
},
```

then run

`pnpm inject:styles`

This will insert (if you run it again, it will update) a section of styles needed by the `obsidian-settings-ui`.

## 🧱 Creating Setting Panel

Now that we've installed the necessary packages and styles, we can begin creating our settings panel.

Let's assume we have a plugin class called ReposPlugin. In this class, we need:

```ts
export default class ReposPlugin extends Plugin {
    settings: ReposPluginSettings;
    async onload() {
        await this.loadSettings();
        ...
        this.addSettingTab(new ReposPluginSettingTab(this));
        ...
    }
    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }
}
```

Next, in the corresponding settings tab class (ReposPluginSettingTab):

```ts
export class ReposPluginSettingTab extends PluginSettingTab {
  renderer: Renderer<ReposPluginSettings>;
  constructor(private plugin: ReposPlugin) {
    super(plugin.app, plugin);
    this.renderer = new Renderer(plugin, plugin.settings, DEFAULT_SETTINGS, this);
  }

  async display(): Promise<void> {
    this.containerEl = await this.renderer.display(this.containerEl, this._getConfig());
  }

  private _getConfig(): SettingsConfig<ReposPluginSettings> {
    return {
      elements: [
        {
          type: 'SettingGroup',
          id: 'settingGroup.access',
          label: 'Access',
          items: [
            {
              type: 'Textfield',
              path: 'github_token',
              label: 'GitHub Token',
            },
          ],
        },
      ],
    };
  }
}
```

**Explanation:**

The `display(...)` method of the `Renderer` instance takes the current container and your settings configuration object, evaluates all contained conditions, and renders the result into a new container. This approach helps avoid flickering during refreshes. Finally, the new container is returned and displayed by Obsidian.

Refer to the `SettingConfig` documentation for more information.

## 📜 License

MIT — use freely, modify, and contribute back!

Made with ❤️ for Obsidian developers.
