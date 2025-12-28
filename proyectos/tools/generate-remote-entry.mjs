import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Genera (o sobreescribe) un remoteEntry.json para Native Federation
 * descubriendo el chunk real desde el bundle generado.
 *
 * Uso:
 *   node tools/generate-remote-entry.mjs --dist dist --name financiero --out remoteEntry.json
 *
 * Qué hace:
 * - Lee dist/main.js (o busca un main*.js si no existe)
 * - Encuentra el import("/chunk-XXXX.js") que corresponde al bootstrap chunk
 * - Escribe un remoteEntry.json con exposes apuntando a ese chunk
 */

function arg(name, fallback) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return fallback;
  const v = process.argv[idx + 1];
  if (!v || v.startsWith('--')) return fallback;
  return v;
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function findMainJs(distDir) {
  const mainJs = path.join(distDir, 'main.js');
  if (await fileExists(mainJs)) return mainJs;

  const files = await fs.readdir(distDir);
  const candidates = files
    .filter((f) => /^main.*\.js$/i.test(f))
    .map((f) => path.join(distDir, f));

  if (candidates.length === 0) {
    throw new Error(`No se encontró main.js ni main*.js dentro de ${distDir}`);
  }

  // toma el primero (normalmente solo hay uno)
  return candidates[0];
}

function extractBootstrapChunk(mainText) {
  // Angular dev/prod suele tener imports dinámicos así:
  // import("/chunk-ABC123.js").catch(...)
  // import("./chunk-ABC123.js").catch(...)
  const m = mainText.match(/import\((["'])(?:\/|\.\/)(chunk-[A-Z0-9]+\.js)\1\)/);
  if (!m) {
    throw new Error('No se pudo inferir el chunk desde main.js (regex no matcheó)');
  }
  return m[2];
}

async function main() {
  const distDir = arg('dist', 'dist');
  const name = arg('name');
  const out = arg('out', 'remoteEntry.json');

  if (!name) {
    throw new Error('Falta --name (ej: onboarding, financiero)');
  }

  const mainFile = await findMainJs(distDir);
  const mainText = await fs.readFile(mainFile, 'utf-8');
  const chunk = extractBootstrapChunk(mainText);

  const json = {
    name,
    shared: [],
    exposes: [
      { key: './Bootstrap', outFileName: chunk },
      { key: './Mount', outFileName: chunk },
      { key: './Component', outFileName: chunk },
    ],
  };

  await fs.writeFile(out, JSON.stringify(json, null, 2) + '\n', 'utf-8');
  // eslint-disable-next-line no-console
  console.log(`[generate-remote-entry] OK: ${out} -> ${chunk}`);
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error('[generate-remote-entry] ERROR:', e?.message || e);
  process.exit(1);
});


