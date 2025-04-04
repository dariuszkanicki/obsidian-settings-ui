import { Setting } from 'obsidian';

export function hint(setting: Setting, key: string, hint: string) {
  const hintWrapper = document.createElement('span');
  hintWrapper.className = 'dkani-ui-hint-wrapper';

  const hintIcon = document.createElement('span');
  hintIcon.className = 'dkani-ui-hint-icon';
  hintIcon.tabIndex = 0;
  hintIcon.innerText = 'ℹ️';
  const uid = `hint-${key}`;
  hintIcon.setAttribute('aria-describedby', uid);

  const tooltip = document.createElement('div');
  tooltip.className = 'dkani-ui-tooltip';
  tooltip.id = uid;
  tooltip.role = 'tooltip';
  tooltip.innerText = hint;

  hintWrapper.appendChild(hintIcon);
  hintWrapper.appendChild(tooltip);
  setting.nameEl.appendChild(hintWrapper);
}
