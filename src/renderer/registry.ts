import { AbstractBaseRenderer } from "./impl/abstract-base-renderer.js";
import { AbstractGroupRenderer } from "./impl/abstract-group-renderer.js";
import { AbstractPathRenderer } from "./impl/abstract-path-renderer.js";
import { ButtonRenderer } from "./impl/button-renderer.js";
import { ColorpickerRenderer } from "./impl/colorpicker-renderer.js";
import { DropdownRenderer } from "./impl/dropdown-renderer.js";
import { RadioGroupRenderer } from "./impl/radiogroup-renderer.js";
import { StatusRenderer } from "./impl/status-renderer.js";
import { InputfieldRenderer } from "./impl/textfield-renderer.js";
import { ToggleRenderer } from "./impl/toggle-renderer.js";
import { BaseSetting, GroupSetting, PathSetting, RadioGroup } from "./types.js";

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
  }
  | {
    type: "radio";
    ctor: new <T>(element: RadioGroup<T>) => RadioGroupRenderer<T>;
  };

export const rendererRegistry: Record<string, RendererConstructor> = {
  Button: { type: "base", ctor: ButtonRenderer },
  Status: { type: "base", ctor: StatusRenderer },
  RadioGroup: { type: "radio", ctor: RadioGroupRenderer },
  Textfield: { type: "path", ctor: InputfieldRenderer },
  Numberfield: { type: "path", ctor: InputfieldRenderer },
  Textarea: { type: "path", ctor: InputfieldRenderer },
  Dropdown: { type: "path", ctor: DropdownRenderer },
  Toggle: { type: "path", ctor: ToggleRenderer },
  Color: { type: "path", ctor: ColorpickerRenderer },
};
