import { existsSync } from 'fs';
import { execSync } from 'child_process';

export function waitForPath(path: string, timeout = 5000): boolean {
  const start = Date.now();
  while (!existsSync(path)) {
    if (Date.now() - start > timeout) return false;
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 50); // sleep
  }
  return true;
}

const rendererPath = 'dist/lib/renderer';
if (waitForPath(rendererPath)) {
  execSync('pnpm build && yalc publish && yalc push', { stdio: 'inherit' });
} else {
  console.error(`❌ Renderer output folder missing: ${rendererPath}`);
  process.exit(1);
}
