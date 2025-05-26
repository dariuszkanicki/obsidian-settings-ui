import { Replacement, SettingHandler } from './types-api.js';

export type CommonProperties = {
  type: string;
  label?: string;
  hint?: string;
  tooltip?: string[];
  replacements?: () => Replacement[];
  showIf?: boolean | (() => boolean);
};

// export type CommonExtendedProperties = {}

// export type CommonPropertiesWithId = CommonProperties & {
//   /**
//    * if you provide 'id' but not 'label'
//    */
//   id: string;
//   label?: string;
// };
// export type CommonPropertiesWithLabel = CommonProperties & {
//   id?: string;
//   label: string;
// };

// export type BaseSetting = CommonPropertiesWithId | CommonPropertiesWithLabel;

// export type BaseSetting = CommonProperties & {
//   id: string;
// };

export type BaseSetting = {
  type?: string;
  /**
   * Is mandatory if localization is used
   */
  id?: string;
  showIf?: boolean;
  /**
   * Sometimes useful with localization, allowing to replace named placeholders<br/>
   * in language specific text with values which are independent or representing current context.
   * @returns
   */
  replacements?: () => Replacement[];
};

export type CommonPathProperties<T> = {
  placeholder?: string | number;
  preSave?: (value: any) => void | Promise<void>;
  postSave?: () => void;
};
export type PathSettingWithPath<T> = CommonPathProperties<T> &
  CommonProperties & {
    path: Path<T>;
    handler?: never; // ⛔️ disallow if path is used
    // id?: never; // ⛔️ disallow if path is used
  };

export type PathSettingWithHandlerBase<T> = CommonPathProperties<T> &
  CommonProperties & {
    handler: SettingHandler;
    path?: never; // ⛔️ disallow if handler is used
  };

export type PathSettingWithHandlerAndLabel<T> = PathSettingWithHandlerBase<T> & {
  id?: string;
  label: string;
};

// When using a handler, if you do supply an id then the label is optional.
export type PathSettingWithHandlerAndId<T> = PathSettingWithHandlerBase<T> & {
  id: string;
  label?: string;
};

// 🔹additionally for settings that store values (e.g., in your plugin's settings object)
export type PathSetting<T> = PathSettingWithPath<T> | PathSettingWithHandlerAndLabel<T> | PathSettingWithHandlerAndId<T>;

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
