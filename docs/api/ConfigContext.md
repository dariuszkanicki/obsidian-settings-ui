# `ConfigContext<T>`

## Properties
| Name | Type | Description |
| ---- | ---- | ----------- |
| `app` | `App` | |
| `plugin` | `Plugin` | |
| `pluginId` | `string` | |
| `settings` | `T` | |
| `defaults` | `T` | |
| `container` | `HTMLElement` | |
| `saveData` | `(settings: T) => Promise<void>` | |
| `refreshSettings` | `() => Promise<void>` | |
| `localizedSettingMap` | `Map<string, `[`LocalizedSetting`](LocalizedSetting)`> \| null` | |