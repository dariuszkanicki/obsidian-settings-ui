import { AbstractBaseRenderer } from './impl/abstract-base-renderer.js';
import { AbstractGroupRenderer } from './impl/abstract-group-renderer.js';
import { AbstractPathRenderer } from './impl/abstract-path-renderer.js';
import { ButtonRenderer } from './impl/button-renderer.js';
import { ColorDropdownRenderer } from './impl/colordropdown-renderer.js';
import { ColorpickerRenderer } from './impl/colorpicker-renderer.js';
import { DropdownRenderer } from './impl/dropdown-renderer.js';
import { NumberfieldRenderer } from './impl/numberfield-renderer.js';
import { PasswordRenderer } from './impl/password-renderer.js';
import { RadioGroupRenderer } from './impl/radiogroup-renderer.js';
import { StatusRenderer } from './impl/status-renderer.js';
import { InputfieldRenderer } from './impl/textfield-renderer.js';
import { ToggleRenderer } from './impl/toggle-renderer.js';
import { BaseSetting, PathSetting } from './types.js';
import { GroupSetting } from './types-api.js';
import { RadioGroup } from './types-api.js';

type RendererConstructor =
  | {
      type: 'base';
      ctor: new <T>(element: BaseSetting) => AbstractBaseRenderer<T>;
    }
  | {
      type: 'group';
      ctor: new <T>(element: GroupSetting<T>) => AbstractGroupRenderer<T>;
    }
  | {
      type: 'path';
      ctor: new <T>(element: PathSetting<T>) => AbstractPathRenderer<T>;
    }
  | {
      type: 'radio';
      ctor: new <T>(element: RadioGroup<T>) => RadioGroupRenderer<T>;
    };

export const rendererRegistry: Record<string, RendererConstructor> = {
  Button: { type: 'base', ctor: ButtonRenderer },
  Status: { type: 'base', ctor: StatusRenderer },
  RadioGroup: { type: 'radio', ctor: RadioGroupRenderer },
  Numberfield: { type: 'path', ctor: NumberfieldRenderer },
  Password: { type: 'path', ctor: PasswordRenderer },
  Textfield: { type: 'path', ctor: InputfieldRenderer },
  Textarea: { type: 'path', ctor: InputfieldRenderer },
  Dropdown: { type: 'path', ctor: DropdownRenderer },
  Toggle: { type: 'path', ctor: ToggleRenderer },
  ColorPicker: { type: 'path', ctor: ColorpickerRenderer },
  ColorDropdown: { type: 'path', ctor: ColorDropdownRenderer },
};
