# `PathSettingWithHandlerBase` (interface)

```ts
export interface PathSettingWithHandlerBase {
handler: SettingHandler;
  // id: string; // ✅ required when handler is present
  path?: never; // ⛔️ disallow if handler is used
  placeholder?: string | number;
  customInputClass?: string;
  preSave?: (value: any) => void | Promise<void>;
  postSave?: () => void;
}
```

## Properties
- `handler`: `SettingHandler`
- `path`: `never; // ⛔️ disallow if handler is used`
- `placeholder`: `string | number`
- `customInputClass`: `string`
- `preSave`: `(value: any) => void | Promise<void>`
- `postSave`: `() => void`