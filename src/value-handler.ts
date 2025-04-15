import { Path, getByPath, setByPath } from './path';

export class ValueHandler<T extends Record<string, any>> {
  constructor(
    private settings: T,
    private saveData: (settings: T) => Promise<void>
  ) {}

  getValue(element: { path?: Path<T>; handler?: any }) {
    return element.handler
      ? element.handler.getValue()
      : getByPath(this.settings, element.path);
  }

  async setValue(
    element: {
      path?: Path<T>;
      handler?: any;
      type?: string;
      preSave?: (v: any) => void;
      create?: () => any;
    },
    value: any
  ) {
    if (element.handler) {
      element.handler.setValue(value);
      return;
    }
    if (
      element.type === 'SettingObjectElement' &&
      typeof element.create === 'function'
    ) {
      setByPath(this.settings, element.path, element.create());
    } else {
      setByPath(this.settings, element.path, value);
    }
    if (element.preSave) element.preSave(value);
    await this.saveData(this.settings);
  }
}
