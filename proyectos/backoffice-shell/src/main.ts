import { initFederation } from '@angular-architects/native-federation';
import type { EnableMfConfig } from './mf/mf-config';

async function loadEnableMfConfig(): Promise<EnableMfConfig> {
  const res = await fetch('/assets/enable-mf.json', { cache: 'no-store' });
  if (!res.ok) throw new Error(`No se pudo cargar /assets/enable-mf.json (${res.status})`);
  return (await res.json()) as EnableMfConfig;
}

loadEnableMfConfig()
  .then(async (cfg) => {
    const remotes = Object.fromEntries(
      (cfg.microfrontends || [])
        .filter((m) => m.enabled !== false)
        .map((m) => [m.id, m.remoteEntry])
    );

    await initFederation(remotes);

    const { bootstrapShell } = await import('./bootstrap');
    await bootstrapShell(cfg);
  })
  .catch((err) => {
    console.error('Error inicializando Shell (enable-mf / federation):', err);
    throw err;
  });
