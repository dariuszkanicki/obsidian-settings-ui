# `PathSettingWithPath<T>`
**Extends:** CommonPathProperties & CommonProperties
## Properties
| Name | Type | Description |
| ---- | ---- | ----------- |
| `path` | `Path<T>` | |
| `handler?` | `never` | |
| `id?` | `never` | |
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