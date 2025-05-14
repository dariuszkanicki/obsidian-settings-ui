# `Path` (type)

```ts
export type Path = 3> = [D] extends [never]
  ? never
  : {
      [K in keyof T & string]: T[K] extends object ? (T[K] extends any[] ? never : K | `${K}.${Path<T[K], PrevDepth[D]>}`) : K;
```

**Extends:** [`3> = [D] extends [never]
  ? never
  :`](3> = [D] extends [never]
  ? never
  :.md)