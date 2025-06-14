import path from 'node:path';
import fs from 'node:fs';
import postcss from 'postcss';
import prefixSelector from 'postcss-prefix-selector';

function escapeForRegex(str: string) {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

injectStyles().catch((err) => {
  console.error('❌ Error injecting styles:', err);
  process.exit(1);
});

export async function injectStyles() {
  const manifestPath = path.resolve('manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('❌ manifest.json not found.');
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as { id: string };

  injectPrefixedStyles({
    pluginDir: process.cwd(),
    pluginId: manifest.id,
    sourceCssPath: path.resolve('node_modules/@dkani/obsidian-settings-ui/styles/source-styles.css'),
    targetCssPath: path.resolve('styles.css'),
  });
}

export async function injectPrefixedStyles({
  pluginDir,
  pluginId,
  sourceCssPath,
  targetCssPath,
}: {
  pluginDir: string;
  pluginId: string;
  sourceCssPath: string;
  targetCssPath: string;
}): Promise<void> {
  if (!fs.existsSync(sourceCssPath)) {
    throw new Error(`❌ Source CSS not found: ${sourceCssPath}`);
  }

  const startMarker = `/* >>> Begin of generated styles @dkani */`;
  const endMarker = `/* <<< End of generated styles @dkani */`;

  const sourceCss = fs.readFileSync(sourceCssPath, 'utf8');
  const existingTargetCss = fs.existsSync(targetCssPath) ? fs.readFileSync(targetCssPath, 'utf8') : '';

  // Transform styles using postcss
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

  const regex = new RegExp(escapeForRegex(startMarker) + '[\\s\\S]*?' + escapeForRegex(endMarker), 'g');

  let updatedCss: string;
  if (regex.test(existingTargetCss)) {
    updatedCss = existingTargetCss.replace(regex, prefixedBlock);
    console.log(`🔁 Replaced existing prefixed block for '${pluginId}'.`);
  } else {
    updatedCss = `${existingTargetCss.trim()}\n\n${prefixedBlock}`;
    console.log(`✅ Injected prefixed block for '${pluginId}'.`);
  }

  fs.writeFileSync(targetCssPath, updatedCss + '\n', 'utf8');
}
