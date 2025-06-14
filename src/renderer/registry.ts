import type { AbstractBaseRenderer } from './impl/abstract-base-renderer.js';
import type { AbstractGroupRenderer } from './impl/abstract-group-renderer.js';
import type { AbstractPathRenderer } from './impl/abstract-path-renderer.js';
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
import type { BaseSetting, PathSetting } from './types.js';
import type { GroupSetting, Message } from './types-api.js';
import type { RadioGroup } from './types-api.js';
import { MessageRenderer } from './impl/message-renderer.js';

type RendererConstructor =
  | {
      type: 'base';
      ctor: new (element: BaseSetting) => AbstractBaseRenderer;
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
    }
  | {
      type: 'msg';
      ctor: new (element: Message) => MessageRenderer;
    };

export const rendererRegistry: Record<string, RendererConstructor> = {
  Button: { type: 'base', ctor: ButtonRenderer },
  Status: { type: 'base', ctor: StatusRenderer },
  RadioGroup: { type: 'radio', ctor: RadioGroupRenderer },
  Message: { type: 'msg', ctor: MessageRenderer },
  Numberfield: { type: 'path', ctor: NumberfieldRenderer },
  Password: { type: 'path', ctor: PasswordRenderer },
  Textfield: { type: 'path', ctor: InputfieldRenderer },
  Textarea: { type: 'path', ctor: InputfieldRenderer },
  Dropdown: { type: 'path', ctor: DropdownRenderer },
  Toggle: { type: 'path', ctor: ToggleRenderer },
  ColorPicker: { type: 'path', ctor: ColorpickerRenderer },
  ColorDropdown: { type: 'path', ctor: ColorDropdownRenderer },
};
