import fs from 'node:fs';
import path from 'node:path';

function patchFile(filePath, { marker, apply }) {
  if (!fs.existsSync(filePath)) {
    console.warn(`[patch-native-federation] Skip (missing): ${filePath}`);
    return false;
  }

  const original = fs.readFileSync(filePath, 'utf-8');
  if (original.includes(marker)) {
    console.log(`[patch-native-federation] Already patched: ${path.basename(filePath)}`);
    return false;
  }

  const updated = apply(original);
  if (updated === original) {
    console.warn(`[patch-native-federation] No changes applied: ${filePath}`);
    return false;
  }

  fs.writeFileSync(filePath, updated, 'utf-8');
  console.log(`[patch-native-federation] Patched: ${filePath}`);
  return true;
}

const repoRoot = process.cwd();
const nfAdapter = path.join(
  repoRoot,
  'node_modules',
  '@angular-architects',
  'native-federation',
  'src',
  'utils',
  'angular-esbuild-adapter.js'
);

// Angular 21 ya no expone este subpath:
//   @angular-devkit/build-angular/src/utils/tailwind
// Native Federation 18.2.x lo requiere a nivel de módulo, lo que rompe el build.
// Parche: require "seguro" y fallback que desactiva tailwind si no existe.
patchFile(nfAdapter, {
  marker: 'PATCHED_TAILWIND_OPTIONAL_REQUIRE',
  apply: (src) => {
    const needle = 'const tailwind_1 = require("@angular-devkit/build-angular/src/utils/tailwind");';
    if (!src.includes(needle)) return src;

    const replacement =
      [
        '// PATCHED_TAILWIND_OPTIONAL_REQUIRE',
        'let tailwind_1;',
        'try {',
        '    tailwind_1 = require("@angular-devkit/build-angular/src/utils/tailwind");',
        '}',
        'catch (_e) {',
        '    tailwind_1 = { findTailwindConfigurationFile: async () => undefined };',
        '}'
      ].join('\n');

    return src.replace(needle, replacement);
  }
});


