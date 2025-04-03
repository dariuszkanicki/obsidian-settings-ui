// build.mjs
import { execSync } from "child_process";
import { rmSync, mkdirSync, copyFileSync, existsSync } from "fs";
import { resolve } from "path";

// Paths
const dist = resolve("dist");
const cssSrc = resolve("styles", "styles.css");
const cssDest = resolve(dist, "styles.css");

// Step 1: Clean dist/
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

// Step 2: Compile TypeScript
console.log("📦 Compiling TypeScript...");
execSync("tsc", { stdio: "inherit" });
// Check what got emitted
// if (!existsSync(resolve(dist, "index.js"))) {
//     console.warn("⚠️ TypeScript did not emit index.js");
// }
// if (!existsSync(resolve(dist, "index.d.ts"))) {
//     console.warn("⚠️ TypeScript did not emit index.d.ts");
// }

// Step 3: Copy styles.css
console.log("🎨 Copying styles.css...");
copyFileSync(cssSrc, cssDest);

console.log("✅ Build complete.");
