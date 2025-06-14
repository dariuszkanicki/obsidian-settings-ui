// Utility type to extract dot-paths from nested object
// Supports max depth of 3 to avoid TS2589 (excessive recursion)

export type Path<T, Prev extends string = '', Depth extends number = 3> = [Depth] extends [never]
  ? never
  : {
      [K in keyof T & (string | number)]: T[K] extends Record<string, any>
        ? `${Prev}${K}` | Path<T[K], `${Prev}${K}.`, PrevDepth<Depth>>
        : `${Prev}${K}`;
    }[keyof T & (string | number)];

// Helper to decrement recursion depth
export type PrevDepth<D extends number> = D extends 3 ? 2 : D extends 2 ? 1 : D extends 1 ? never : never;

// Utility type to get the value at a given path (max depth 3)
export type ValueAtPath<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Rest extends Path<T[K], ''>
      ? ValueAtPath<T[K], Rest>
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never;

// Helper to get value by path from object
export function getByPath<T>(obj: T, path: string): any {
  return path.split('.').reduce((acc: any, key: string) => acc?.[key], obj);
}

// Helper to set value by path on object
export function setByPath<T>(obj: T, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((acc: any, key: string) => (acc[key] ??= {}), obj);
  if (lastKey) {
    target[lastKey] = value;
  }
}

export function getByPathAsString(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

export function setByPathAsString(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((acc, key) => (acc[key] ??= {}), obj);
  if (lastKey) target[lastKey] = value;
}
