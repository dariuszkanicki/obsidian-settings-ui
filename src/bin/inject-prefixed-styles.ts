#!/usr/bin/env node

import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import prefixSelector from "postcss-prefix-selector";

function escapeForRegex(str: string) {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

// Emulate __dirname 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Detect root directory
const match = __dirname.match(/^(.*obsidian-settings-ui)/i);
if (!match || !match[1]) {
  throw new Error(`Could not determine rootDir from __dirname: ${__dirname}`);
}
const rootDir = match[1];

// Resolve plugin location
const cwd = process.cwd();
const isTest = cwd.includes("obsidian-settings-ui");
const pluginDir = isTest ? path.join(rootDir, "test-fixtures") : cwd;

// Paths
const manifestPath = path.join(pluginDir, "manifest.json");
const targetCssPath = path.join(pluginDir, "styles.css");
const sourceCssPath = isTest
  ? path.join(rootDir, "styles/source-styles.css")
  : path.join(pluginDir, "node_modules/@dkani/obsidian-settings-ui/styles/source-styles.css");

// Read plugin ID
if (!fs.existsSync(manifestPath)) {
  console.error("❌ Could not find manifest.json in the plugin directory.");
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as { id: string };
const pluginId = manifest.id;

// Markers
const startMarker = `/* >>> Begin of generated styles @dkani */`;
const endMarker = `/* <<< End of generated styles @dkani */`;

async function main() {
  if (!fs.existsSync(sourceCssPath)) {
    console.error(`❌ Could not find source styles at: ${sourceCssPath}`);
    process.exit(1);
  }

  const sourceCss = fs.readFileSync(sourceCssPath, "utf8");
  const existingTargetCss = fs.existsSync(targetCssPath)
    ? fs.readFileSync(targetCssPath, "utf8")
    : "";

  // Transform shared styles
  const result = await postcss([
    prefixSelector({
      prefix: `.${pluginId}`,
      transform(prefix, selector) {
        return selector.replace(/\.(dkani-ui-[\w-]+)/g, (_, className) => {
          return `.${pluginId}-${className}`;
        });
      },
    }),
  ]).process(sourceCss, { from: undefined });

  const prefixedBlock = `\n${startMarker}\n${result.css}\n${endMarker}\n`;

  // Replace or inject the block
  const regex = new RegExp(
    escapeForRegex(startMarker) + '[\\s\\S]*?' + escapeForRegex(endMarker),
    "g"
  );

  let updatedCss: string;
  console.log("🔍 existingTargetCss:", existingTargetCss);
  console.log("🔍 regex:", regex);
  console.log("🔍 Matched section:", existingTargetCss.match(regex)?.[0]);
  if (regex.test(existingTargetCss)) {
    updatedCss = existingTargetCss.replace(regex, prefixedBlock);
    console.log(`🔁 Replaced existing prefixed block for '${pluginId}'.`);
  } else {
    updatedCss = `${existingTargetCss.trim()}\n\n${prefixedBlock}`;
    console.log(`✅ Injected prefixed block for '${pluginId}'.`);
  }

  fs.writeFileSync(targetCssPath, updatedCss + "\n", "utf8");
}

main().catch((err) => {
  console.error("❌ Error during PostCSS processing:", err);
  process.exit(1);
});
