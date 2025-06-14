import colorString from 'color-string';
import { colord } from 'colord';

function _stringToHex(val: string): string | undefined {
  const parsed = colorString.get(val); // { model: 'rgb', value: [0, 0, 0, 1] }
  let hex;
  if (parsed?.value) {
    const [r, g, b, a] = parsed.value as [number, number, number, number?];
    hex = colorString.to.hex(r, g, b, a) ?? undefined;
  }
  return hex;
}
function _cssVarToHex(containerEl: HTMLElement, variable: string): string {
  const temp = document.createElement('div');
  temp.style.color = variable;
  containerEl.appendChild(temp);
  const computed = getComputedStyle(temp).color;
  temp.remove();
  return colord(computed).toHex();
}

export function colorHEX(containerEl: HTMLElement, value: string) {
  let _color = _stringToHex(value);
  if (!_color) {
    _color = _cssVarToHex(containerEl, value);
  }
  return _color;
}
