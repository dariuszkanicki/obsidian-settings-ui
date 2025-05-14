# `GroupSetting` (interface)

```ts
export interface GroupSetting {
type: string;
  items: SettingElement<T>[];
  id?: string;
  label?: string;
  showIf?: boolean;
}
```

## Properties
- `type`: `string`
- `items`: `SettingElement<T>[]`
- `id`: `string`
- `label`: `string`
- `showIf`: `boolean`