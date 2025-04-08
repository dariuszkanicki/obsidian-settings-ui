#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import postcss from 'postcss';
import prefixSelector from 'postcss-prefix-selector';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const match = __dirname.match(/^(.*obsidian-settings-ui)/i);
const rootDir = match?.[1];

// 1. Resolve target (consumer plugin) root
// 🧪 Use test fixture paths if testing standalone
const cwd = process.cwd();
const isTest = cwd.includes('obsidian-settings-ui');
const pluginDir = isTest ? path.join(rootDir, 'test-fixtures') : cwd;

// Paths
const manifestPath = path.join(pluginDir, 'manifest.json');
console.log("manifestPath",manifestPath);

const targetCssPath = path.join(pluginDir, 'styles.css');
const sourceCssPath = isTest ? 
                path.join(rootDir, 'styles/source-styles.css') 
                :
                path.join(pluginDir, 'node_modules/@dkani/obsidian-settings-ui/styles/source-styles.css');

// 2. Read manifest for plugin ID
if (!fs.existsSync(manifestPath)) {
  console.error('❌ Could not find manifest.json in the plugin directory.');
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const pluginId = manifest.id;

// 3. Marker block
const startMarker = `/* >>> Prefixed styles from @dkani/styles for ${pluginId} >>> */`;
const endMarker = `/* <<< End of prefixed styles for ${pluginId} <<< */`;

// 4. Resolve shared styles
// const sourceCssPath = path.join(pluginRoot, 'node_modules/@dkani/styles/styles.css');
if (!fs.existsSync(sourceCssPath)) {
  console.error(`❌ Could not find source styles at: ${sourceCssPath}`);
  process.exit(1);
}
const sourceCss = fs.readFileSync(sourceCssPath, 'utf8');

// 5. Skip if already injected
const targetCss = fs.existsSync(targetCssPath) ? fs.readFileSync(targetCssPath, 'utf8') : '';
if (targetCss.includes(startMarker)) {
  console.log(`✅ Shared styles already injected for '${pluginId}', skipping.`);
  process.exit(0);
}

// 6. Prefix the source CSS
postcss([
  prefixSelector({
    prefix: `.${pluginId}`,
    transform(prefix, selector) {
      return selector.replace(/\.(dkani-ui-[\w-]+)/g, (_, className) => {
        return `.${pluginId}-${className}`;
      });
    }
  })
])
  .process(sourceCss, { from: undefined })
  .then(result => {
    const prefixedBlock = `\n${startMarker}\n${result.css}\n${endMarker}\n`;
    const mergedCss = `${targetCss.trim()}\n\n${prefixedBlock}`;
    fs.writeFileSync(targetCssPath, mergedCss, 'utf8');
    console.log(`✅ Shared styles injected for '${pluginId}' into styles.css`);
  })
  .catch(err => {
    console.error('❌ Error during PostCSS processing:', err);
    process.exit(1);
  });
