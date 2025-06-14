import { PluginSettingTab } from 'obsidian';
import { ContextService } from './context-service.js';

/**
 * This function creates a clone of the current container,
 * renders the content of the settings panel into it,
 * and scrolls to the previously remembered position on the screen.
 * This approach avoids screen flickering,
 * as the "refresh" occurs while the container remains hidden.
 */
export async function replaceAndDisplay(
  currentContainer: HTMLElement,
  renderInto: (target: HTMLElement) => Promise<void> | void,
  restoreScrollTop?: number,
): Promise<HTMLElement> {
  const parent = currentContainer.parentElement;
  if (!parent) {
    throw new Error('Container has no parent');
  }
  const newContainer = currentContainer.cloneNode(false) as HTMLElement;
  newContainer.style.visibility = 'hidden';

  parent.insertBefore(newContainer, currentContainer.nextSibling);

  await renderInto(newContainer);

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (typeof restoreScrollTop === 'number') {
          newContainer.scrollTop = restoreScrollTop;
        }
        newContainer.style.visibility = '';
        parent.removeChild(currentContainer);
        resolve();
      });
    });
  });
  return newContainer;
}

export function refreshDisplayWithDelay(timeout = 80): void {
  setTimeout(() => ContextService.settingTab().display(), timeout);
}
