import { HowToSectionConfig } from ".";

export function renderHowToSection(
    container: HTMLElement,
    config: HowToSectionConfig
  ) {
    const { title, description, readmeURL, classes = {} } = config;
  
    const howto = container.createEl("div", {
      cls: classes.wrapper ?? "dkani-ui-howto",
    });
    howto.createEl("div", {
      text: title ?? "How to use this plugin",
      cls: classes.title ?? "dkani-ui-howto-title",
    });
    const small = howto.createEl("small", {
      text: description,
      cls: classes.description ?? "dkani-ui-howto-text",
    });
    if (readmeURL) {
      small.createEl("br");
      small.createEl("br");
      small.createEl("span", { text: "See the " });
      small.createEl("a", {
        href: readmeURL,
        text: "README",
        title: readmeURL,
      });
      small.createEl("span", {
        text: " for more information and troubleshooting.",
      });
    }
  }
  