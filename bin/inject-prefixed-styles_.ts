#!/usr/bin/env ts-node

import path from 'path';
import fs from 'fs';
import postcss from 'postcss';
import prefixSelector from 'postcss-prefix-selector';

// 🧪 Use test fixture paths if testing standalone
const cwd = process.cwd();
const isTest = cwd.includes('obsidian-settings-ui');
const pluginDir = isTest ? path.join(__dirname, '../test-fixtures') : cwd;

// Paths
const manifestPath = path.join(pluginDir, 'manifest.json');
const targetCssPath = path.join(pluginDir, 'styles.css');
const sourceCssPath = path.join(__dirname, '../styles/source-styles.css');

// Plugin ID
if (!fs.existsSync(manifestPath)) {
  console.error('❌ manifest.json not found in target plugin directory.');
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const pluginId = manifest.id;

const startMarker = `/* >>> Prefixed styles for ${pluginId} >>> */`;
const endMarker = `/* <<< End of prefixed styles for ${pluginId} <<< */`;

if (!fs.existsSync(sourceCssPath)) {
  console.error(`❌ Source styles not found: ${sourceCssPath}`);
  process.exit(1);
}

const existingCss = fs.existsSync(targetCssPath)
  ? fs.readFileSync(targetCssPath, 'utf8')
  : '';

if (existingCss.includes(startMarker)) {
  console.log(`✅ Prefixed block for ${pluginId} already exists.`);
  process.exit(0);
}

const sourceCss = fs.readFileSync(sourceCssPath, 'utf8');

postcss([
  prefixSelector({
    prefix: `.${pluginId}`,
    transform(prefix, selector, prefixedSelector) {
      if (
        selector.startsWith(`.${pluginId}`) ||
        selector.startsWith('.mod-') ||
        selector.startsWith('.setting') ||
        selector.includes('.cm-') ||
        selector.startsWith(':root') ||
        selector.includes('[class*="')
      ) {
        return selector;
      }
      return prefixedSelector;
    }
  })
])
  .process(sourceCss, { from: undefined })
  .then(result => {
    const newBlock = `\n${startMarker}\n${result.css}\n${endMarker}\n`;
    fs.writeFileSync(targetCssPath, `${existingCss.trim()}\n${newBlock}`, 'utf8');
    console.log(`✅ Styles prefixed and injected into styles.css for '${pluginId}'`);
  })
  .catch(err => {
    console.error('❌ PostCSS processing failed:', err);
    process.exit(1);
  });