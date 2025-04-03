// index.ts

import { Setting } from "obsidian";


export interface SettingElement<K extends keyof any> {
	name: string;
	desc?: string;
	item: K;
	placeholder?: string;
	customItemClass?: string;
	customInputClass?: string;
}

export interface HowToSectionConfig {
	title?: string;                     // Main title of the section (default "How to use this plugin")
	description: string;                // Description or instructions shown below the title
	readmeURL?: string;                 // URL to the README
	classes?: {                         // Optional CSS class overrides
		wrapper?: string;
		title?: string;
		description?: string;
	};
}

export interface SettingsSectionConfig<T extends Record<string, any>> {
	howTo?: HowToSectionConfig;
	elements: Array<
		SettingElement<keyof T>
		| 
		{
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
			const group = container.createEl("div", { cls: "group" });
			group.createEl("div", { text: el.title, cls: "group-title" });

			el.items.forEach((item) =>
				renderSetting(group, item, settings, saveData, true)
			);
		} else {
			const element = el as SettingElement<keyof T>;
			renderSetting(container, element, settings, saveData);
		}
	}
}

function renderHowToSection(container: HTMLElement, config: HowToSectionConfig) {
	const {
		title,
		description,
		readmeURL,
		classes = {},
	} = config;

	const howto = container.createEl("div", { cls: classes.wrapper ?? "howto" });
	howto.createEl("div", {
        text: title ?? "How to use this plugin",
        cls: classes.title ?? "howto-title",
	});
	const small = howto.createEl("small", {
		text: description,
		cls: classes.description ?? "howto-text",
	});
	if (readmeURL) {
		small.createEl("br");
		small.createEl("br");
		small.createEl("span", { text: "See the " });
		small.createEl("a", {
			href: readmeURL,
			text: "README",
            title: readmeURL
		});
		small.createEl("span", { text: " for more information and troubleshooting." });
	}
}

function renderSetting<T extends Record<string, any>, K extends keyof T>(
	container: HTMLElement,
	element: SettingElement<K>,
	settings: T,
	saveData: (settings: T) => Promise<void>,
	groupMember: boolean = false
) {
	const setting = new Setting(container)
		.setName(element.name);
		// .setDesc(element.desc || "");

	if (groupMember) {
		setting.settingEl.addClass("group-item");
	}

	const key = element.item;
	const value = settings[key];
	let inputEl: HTMLInputElement;

	if (typeof value === "boolean") {
		setting.addToggle((toggle) => {
			toggle.setValue(value).onChange(async (val) => {
				settings[key] = val as T[K];
				await saveData(settings);
			});
			if (element.placeholder) toggle.setTooltip(element.placeholder);
		});
	} else {
		setting.addText((text) => {
			inputEl = text.inputEl;
			text.setValue(String(value)).onChange(async (val) => {
				if (typeof value === "number") {
					const parsed = parseFloat(val);
					if (!isNaN(parsed)) {
						settings[key] = parsed as T[K];
						await saveData(settings);
					}
				} else {
					settings[key] = val.trim() as T[K];
					await saveData(settings);
				}
				await saveData(settings);
			});
			if (element.customInputClass) inputEl.classList.add(element.customInputClass);
			if (element.placeholder) text.setPlaceholder(element.placeholder);
		});
		if (element.desc) {
			setting.controlEl.createEl("small", { text: element.desc });
		}
	}
}