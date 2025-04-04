// index.ts

import { Setting } from "obsidian";
import { hint } from "./hint";
import { renderSetting } from "./render-setting";
import { renderHowToSection } from "./render-howto";

export interface SettingElement<K extends keyof any> {
  name: string;
  desc?: string;
  hint?: string;
  item: K;
  placeholder?: string;
  customItemClass?: string;
  customInputClass?: string;
}

export interface HowToSectionConfig {
  title?: string; // Main title of the section (default "How to use this plugin")
  description: string; // Description or instructions shown below the title
  readmeURL?: string; // URL to the README
  classes?: {
    // Optional CSS class overrides
    wrapper?: string;
    title?: string;
    description?: string;
  };
}

export interface SettingsSectionConfig<T extends Record<string, any>> {
  howTo?: HowToSectionConfig;
  elements: Array<
    | SettingElement<keyof T>
    | {
        type: "group";
        title: string;
        items: SettingElement<keyof T>[];
      }
  >;
}

export function renderSettings<T extends Record<string, any>>(
  configSettings: SettingsSectionConfig<T>,
  settings: T,
  container: HTMLElement,
  saveData: (settings: T) => Promise<void>
) {
  container.empty();
  // ✅ Render the howTo section first
  if (configSettings.howTo) {
    renderHowToSection(container, configSettings.howTo);
  }

  for (const el of configSettings.elements) {
    if ("type" in el && el.type === "group") {
      const group = container.createEl("div", { cls: "dkani-ui-group" });
      group.createEl("div", { text: el.title, cls: "dkani-ui-group-title" });

      el.items.forEach((item) =>
        renderSetting(group, item, settings, saveData, true)
      );
    } else {
      const element = el as SettingElement<keyof T>;
      renderSetting(container, element, settings, saveData);
    }
  }
}




