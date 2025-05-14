# `CommonProperties` (interface)

```ts
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
```

## Properties
- `type`: `string`
- `label`: `string`
- `hint`: `string`
- `tooltip`: `string`[]
- `replacements`: () => [`Replacement`](Replacement.md)[]
- `customItemClass`: `string`
- `showIf`: `boolean` | (() => `boolean`)
- `disabled`: `boolean`
- `withoutLabel`: `boolean`