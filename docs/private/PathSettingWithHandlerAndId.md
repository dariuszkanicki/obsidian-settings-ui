# `PathSettingWithHandlerAndId`
**Extends:** PathSettingWithHandlerBase
## Properties
| Name | Type | Description |
| ---- | ---- | ----------- |
| `id` | `string` | |
| `label?` | `string` | |
| `PathSettingWithHandlerBase` | --- | |
| `handler` | `SettingHandler` | |
| `path?` | `never` | |
| `CommonPathProperties` | --- | |
| `placeholder?` | `string \| number` | |
| `preSave?` | `(value: any) => void \| Promise<void>` | |
| `postSave?` | `() => void` | |
| `CommonProperties` | --- | |
| `type` | `string` | |
| `label?` | `string` | |
| `hint?` | `string` | |
| `tooltip?` | `string[]` | |
| `replacements?` | `() => Replacement[]` | |
| `showIf?` | `boolean \| (() => boolean)` | |
| `disabled?` | `boolean` | |
| `withoutLabel?` | `boolean` | |