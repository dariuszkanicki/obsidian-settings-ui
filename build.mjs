// // build.mjs
import { rmSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';
import { build } from 'esbuild';
import fg from 'fast-glob';

const isProd = process.argv.includes('production');
const distDir = resolve('dist/lib');

// 🧹 Step 1: Clean dist/
console.log(`🧹 Cleaning output directory: ${distDir}`);
rmSync('dist', { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

// 📘 Step 2: Emit type declarations only
console.log('📘 Emitting type declarations...');
execSync('tsc', { stdio: 'inherit' });

// 📦 Step 3: Use fast-glob to get all source .ts files (excluding .d.ts)
console.log('🔍 Scanning source files...');
// const entryPoints = await fg(['src/index.ts', 'src/utils/inject-styles.ts']);
const entryPoints = ['src/index.ts'];
console.log(`Found ${entryPoints} entry points.`);

// Step 4: Build with esbuild
console.log(`📦 Building JavaScript (${isProd ? 'production' : 'development'})...`);

await build({
  entryPoints,
  outdir: distDir,
  bundle: true,
  format: 'esm',
  platform: 'node',
  sourcemap: !isProd,
  minify: isProd,
  target: 'es2020',
  splitting: false,
  external: ['obsidian'],
});

console.log('✅ Build complete.');
