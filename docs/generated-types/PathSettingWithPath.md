# `PathSettingWithPath` (interface)

```ts
export interface PathSettingWithPath {
path: Path<T>;
  handler?: never; // ⛔️ disallow if path is used
  id?: never; // ⛔️ disallow if path is used
  placeholder?: string | number;
  customInputClass?: string;
  preSave?: (value: any) => void | Promise<void>;
  postSave?: () => void;
}
```

## Properties
- `path`: `Path<T>`
- `handler`: `never; // ⛔️ disallow if path is used`
- `id`: `never; // ⛔️ disallow if path is used`
- `placeholder`: `string | number`
- `customInputClass`: `string`
- `preSave`: `(value: any) => void | Promise<void>`
- `postSave`: `() => void`