import { Replacement, SettingHandler } from './types-api.js';

export type CommonProperties = {
  type?: string;
  label?: string;
  hint?: string;
  tooltip?: string[];
  replacements?: () => Replacement[];
  showIf?: boolean | (() => boolean);
  disabled?: boolean;
  withoutLabel?: boolean;
};
export type BaseSetting = CommonProperties & {
  id: string;
};
export type CommonPathProperties = {
  placeholder?: string | number;
  preSave?: (value: any) => void | Promise<void>;
  postSave?: () => void;
};
export type PathSettingWithPath<T> = CommonPathProperties &
  CommonProperties & {
    path: Path<T>;
    handler?: never; // ⛔️ disallow if path is used
    id?: never; // ⛔️ disallow if path is used
  };

export type PathSettingWithHandlerBase = CommonPathProperties &
  CommonProperties & {
    handler: SettingHandler;
    path?: never; // ⛔️ disallow if handler is used
  };

export type PathSettingWithHandlerAndLabel = PathSettingWithHandlerBase & {
  id?: string;
  label: string;
};

// When using a handler, if you do supply an id then the label is optional.
export type PathSettingWithHandlerAndId = PathSettingWithHandlerBase & {
  id: string;
  label?: string;
};

// 🔹additionally for settings that store values (e.g., in your plugin's settings object)
export type PathSetting<T> = PathSettingWithPath<T> | PathSettingWithHandlerAndLabel | PathSettingWithHandlerAndId;

// 🔹 Top-level or group-level setting items (generic)

// Limit recursion depth to 3
export type PrevDepth = [never, 0, 1, 2, 3, 4, 5];
/* 
export type Path<T, D extends number = 3> = [D] extends [never]
  ? never
  : {
      [K in keyof T & string]: T[K] extends object ? (T[K] extends any[] ? never : K | `${K}.${Path<T[K], PrevDepth[D]>}`) : K;
    }[keyof T & string];

 */
/* 
export type Path<T, D extends number = 3> = [D] extends [never]
  ? never
  : {
      [K in keyof T & string]: T[K] extends object ? (T[K] extends any[] ? K : K | `${K}.${Path<NonNullable<T[K]>, PrevDepth[D]>}`) : K;
    }[keyof T & string];

 */

// export type Path<T, D extends number = 3> = [D] extends [never]
//   ? never
//   : {
//       [K in keyof T & string]: T[K] extends object ? (T[K] extends any[] ? K : K | `${K}.${Path<NonNullable<T[K]>, PrevDepth[D]>}`) : K;
//     }[keyof T & string];

/* 
export type PathImpl<T, Key extends keyof T> = Key extends string
  ? T[Key] extends Record<string, any>
    ? `${Key}` | `${Key}.${Path<T[Key]>}`
    : `${Key}`
  : never;

export type Path<T> = T extends Record<string, any> ? { [Key in keyof T]-?: PathImpl<T, Key> }[keyof T] : never;
 */

/* this worked
export type PathImpl<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, any>
    ? `${K}` | `${K}.${Path<T[K]>}`
    : `${K}`
  : never;

export type Path<T> = T extends object
  ? {
      [K in keyof T]-?: K extends string ? PathImpl<T, K> | (undefined extends T[K] ? `${K}.${Path<Exclude<T[K], undefined>>}` : never)
        : never;
    }[keyof T]
  : never;

 */
export type PathImpl<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, any>
    ? `${K}` | `${K}.${Path<T[K]>}`
    : `${K}`
  : never;

export type Path<T> = T extends object
  ? {
      [K in keyof T]-?: K extends string ? PathImpl<T, K> | (undefined extends T[K] ? `${K}.${Path<NonNullable<T[K]>>}` : never) : never;
    }[keyof T]
  : never;
