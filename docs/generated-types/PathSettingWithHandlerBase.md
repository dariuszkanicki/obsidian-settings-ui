# `PathSettingWithHandlerBase` (interface)

```ts
export interface PathSettingWithHandlerBase extends CommonProperties {
  handler: SettingHandler;
  // id: string; // ✅ required when handler is present
  path?: never; // ⛔️ disallow if handler is used
  placeholder?: string | number;
  customInputClass?: string;
  preSave?: (value: any) => void | Promise<void>;
  postSave?: () => void;
}
```

**Extends:** [`CommonProperties`](CommonProperties.md)
## Properties
- `handler`: [`SettingHandler`](SettingHandler.md)
- `path`: `never`; // ⛔️ `disallow` `if` `handler` `is` `used`
- `placeholder`: `string` | `number`
- `customInputClass`: `string`
- `preSave`: (`value`: `any`) => `void` | `Promise<void>`
- `postSave`: () => `void`