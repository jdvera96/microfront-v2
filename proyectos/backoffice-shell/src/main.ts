import { initFederation } from '@angular-architects/native-federation';

initFederation('/assets/federation.manifest.json')
  .then(() => import('./bootstrap'))
  .catch((err) => {
    console.error('Error inicializando Native Federation:', err);
    // Importante: NO bootstrapeamos la app si la federación falla,
    // porque luego loadRemoteModule arroja "unknown remote".
    throw err;
  });
