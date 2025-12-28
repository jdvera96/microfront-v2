import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Parche automático para incompatibilidades conocidas:
 * Native Federation v18.2.x + Angular 21 (build-angular internals movidos).
 *
 * Basado en el troubleshooting del RUNBOOK:
 * - builder.js: reemplaza require(...) dev-server/options por un stub normalizeOptions
 * - angular-esbuild-adapter.js: reemplaza require(...) tailwind por un stub
 *
 * Uso (en un proyecto Remote):
 *   node ../tools/patch-native-federation.mjs
 */

const NF_ROOT = path.join('node_modules', '@angular-architects', 'native-federation', 'src');
const BUILDER = path.join(NF_ROOT, 'builders', 'build', 'builder.js');
const ADAPTER = path.join(NF_ROOT, 'utils', 'angular-esbuild-adapter.js');

async function patchFile(filePath, patches) {
  let text = await fs.readFile(filePath, 'utf-8');
  let changed = false;

  for (const { find, replace, id } of patches) {
    if (text.includes(replace)) continue; // ya parchado
    if (!text.includes(find)) {
      // eslint-disable-next-line no-console
      console.warn(`[patch-native-federation] No se encontró patrón (${id}) en ${filePath}`);
      continue;
    }
    text = text.replace(find, replace);
    changed = true;
  }

  if (changed) {
    await fs.writeFile(filePath, text, 'utf-8');
    // eslint-disable-next-line no-console
    console.log(`[patch-native-federation] Patched: ${filePath}`);
  } else {
    // eslint-disable-next-line no-console
    console.log(`[patch-native-federation] OK (sin cambios): ${filePath}`);
  }
}

async function main() {
  await patchFile(BUILDER, [
    {
      id: 'builder.js dev-server/options',
      find: 'const options_1 = require("@angular-devkit/build-angular/src/builders/dev-server/options");',
      replace:
        '/* patched: Angular 21 compat */\n' +
        '// const options_1 = require("@angular-devkit/build-angular/src/builders/dev-server/options");\n' +
        'const options_1 = {\n' +
        '    normalizeOptions: (context, project, options) => Promise.resolve(options)\n' +
        '};',
    },
  ]);

  await patchFile(ADAPTER, [
    {
      id: 'angular-esbuild-adapter.js tailwind',
      find: 'const tailwind_1 = require("@angular-devkit/build-angular/src/utils/tailwind");',
      replace:
        '/* patched: Angular 21 compat */\n' +
        '// const tailwind_1 = require("@angular-devkit/build-angular/src/utils/tailwind");\n' +
        'const tailwind_1 = { findTailwindConfigurationFile: async () => undefined };',
    },
  ]);
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error('[patch-native-federation] ERROR:', e?.message || e);
  process.exit(1);
});


