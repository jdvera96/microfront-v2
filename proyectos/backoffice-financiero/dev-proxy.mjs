import http from 'node:http';
import { URL } from 'node:url';

/**
 * Dev proxy para evitar editar manualmente `remoteEntry.json` en cada rebuild.
 *
 * - Ejecuta `ng serve` del remoto en un puerto interno (por defecto 4204)
 * - Expone un puerto público (por defecto 4203) donde:
 *    - GET /remoteEntry.json => genera el JSON dinámicamente leyendo /main.js del dev-server
 *    - El resto de rutas => se proxyean al dev-server
 */

const PUBLIC_PORT = Number(process.env.PUBLIC_PORT || 4203);
const TARGET_PORT = Number(process.env.TARGET_PORT || 4204);

const TARGET_ORIGIN = `http://localhost:${TARGET_PORT}`;

let cached = { ts: 0, json: null };
const TTL_MS = 1000; // 1s: suficiente para dev y evita request storm

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function getBootstrapChunk() {
  const now = Date.now();
  if (cached.json && now - cached.ts < TTL_MS) return cached.json;

  const mainRes = await fetch(`${TARGET_ORIGIN}/main.js`, { cache: 'no-store' });
  if (!mainRes.ok) {
    throw new Error(`No se pudo leer main.js del remoto (${mainRes.status})`);
  }

  const mainText = await mainRes.text();
  // main.js de Angular dev-server suele verse así:
  // import("/chunk-ABC123.js").catch(...)
  const m = mainText.match(/import\((["'])\/(chunk-[A-Z0-9]+\.js)\1\)/);
  if (!m) {
    throw new Error('No se pudo inferir el chunk desde main.js (regex no matcheó)');
  }
  const chunk = m[2];

  const json = {
    name: 'financiero',
    shared: [],
    exposes: [
      { key: './Bootstrap', outFileName: chunk },
      { key: './Mount', outFileName: chunk },
      { key: './Component', outFileName: chunk },
    ],
  };

  cached = { ts: now, json };
  return json;
}

const server = http.createServer(async (req, res) => {
  try {
    if (!req.url) {
      res.statusCode = 400;
      res.end('Bad Request');
      return;
    }

    const url = new URL(req.url, `http://localhost:${PUBLIC_PORT}`);

    if (req.method === 'OPTIONS') {
      setCors(res);
      res.statusCode = 204;
      res.end();
      return;
    }

    if (req.method === 'GET' && url.pathname === '/remoteEntry.json') {
      const json = await getBootstrapChunk();
      setCors(res);
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(json, null, 2));
      return;
    }

    // Proxy passthrough
    const targetUrl = new URL(req.url, TARGET_ORIGIN);
    const headers = { ...req.headers, host: `localhost:${TARGET_PORT}` };

    const proxyReq = http.request(
      targetUrl,
      {
        method: req.method,
        headers,
      },
      (proxyRes) => {
        setCors(res);
        res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      }
    );

    proxyReq.on('error', (e) => {
      res.statusCode = 502;
      res.end(`Proxy error: ${e?.message || e}`);
    });

    req.pipe(proxyReq, { end: true });
  } catch (e) {
    res.statusCode = 500;
    res.end(`Proxy error: ${e?.message || e}`);
  }
});

server.listen(PUBLIC_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[mf-proxy] Listening on http://localhost:${PUBLIC_PORT} -> ${TARGET_ORIGIN}`);
  // eslint-disable-next-line no-console
  console.log(`[mf-proxy] /remoteEntry.json is now dynamic (no más chunks manuales).`);
});


