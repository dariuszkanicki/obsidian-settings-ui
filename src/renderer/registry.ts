import { AbstractBaseRenderer } from './impl/abstract-base-renderer';
import { AbstractPathRenderer } from './impl/abstract-path-renderer';
import { ButtonRenderer } from './impl/button-renderer';
import { DropdownRenderer } from './impl/dropdown-renderer';
import { StatusRenderer } from './impl/status-renderer';
import { TextfieldRenderer } from './impl/textfield-renderer';
import { ToggleRenderer } from './impl/toggle-renderer';
import { BaseSetting, ConfigContext, PathSetting } from './types';

type RendererConstructor =
  | {
      type: 'base';
      ctor: new <T extends Record<string, any>>(
        context: ConfigContext<T>,
        element: BaseSetting
      ) => AbstractBaseRenderer<T>;
    }
  | {
      type: 'path';
      ctor: new <T extends Record<string, any>>(
        context: ConfigContext<T>,
        element: PathSetting<T>
      ) => AbstractPathRenderer<T>;
    };

export const rendererRegistry: Record<string, RendererConstructor> = {
  Button: { type: 'base', ctor: ButtonRenderer },
  Status: { type: 'base', ctor: StatusRenderer },
  Textfield: { type: 'path', ctor: TextfieldRenderer },
  Dropdown: { type: 'path', ctor: DropdownRenderer },
  Toggle: { type: 'path', ctor: ToggleRenderer },
};
