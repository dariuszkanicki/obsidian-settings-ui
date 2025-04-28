import type { AbstractBaseRenderer } from "./impl/abstract-base-renderer";
import type { AbstractGroupRenderer } from "./impl/abstract-group-renderer";
import type { AbstractPathRenderer } from "./impl/abstract-path-renderer";
import { ButtonRenderer } from "./impl/button-renderer";
import { DropdownRenderer } from "./impl/dropdown-renderer";
import { RadioGroupRenderer } from "./impl/radiogroup-renderer";
import { StatusRenderer } from "./impl/status-renderer";
import { InputfieldRenderer } from "./impl/textfield-renderer";
import { ToggleRenderer } from "./impl/toggle-renderer";
import type { BaseSetting, GroupSetting, PathSetting } from "./types";

type RendererConstructor =
  | {
      type: "base";
      ctor: new <T>(element: BaseSetting) => AbstractBaseRenderer<T>;
    }
  | {
      type: "group";
      ctor: new <T>(element: GroupSetting<T>) => AbstractGroupRenderer<T>;
    }
  | {
      type: "path";
      ctor: new <T>(element: PathSetting<T>) => AbstractPathRenderer<T>;
    };

export const rendererRegistry: Record<string, RendererConstructor> = {
  Button: { type: "base", ctor: ButtonRenderer },
  Status: { type: "base", ctor: StatusRenderer },
  RadioGroup: { type: "group", ctor: RadioGroupRenderer },
  Textfield: { type: "path", ctor: InputfieldRenderer },
  Numberfield: { type: "path", ctor: InputfieldRenderer },
  Textarea: { type: "path", ctor: InputfieldRenderer },
  Dropdown: { type: "path", ctor: DropdownRenderer },
  Toggle: { type: "path", ctor: ToggleRenderer },
};
