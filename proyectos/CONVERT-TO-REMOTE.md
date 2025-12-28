## Instrucciones para IA (Google AI Studio): Convertir cualquier Angular a Microfrontend Remote (Native Federation)

Este documento está escrito para que lo copies/pegues dentro de Google AI Studio (o cualquier IA) y la IA pueda ejecutar **paso por paso** la conversión de un proyecto Angular a **Remote** consumible por un **Shell**.

### Qué arquitectura usa este repo

- **Patrón `RemoteMount`**: el Shell NO importa componentes del Remote como rutas Angular.
- El Shell carga un módulo remoto `./Bootstrap` y llama funciones:
  - `mount(hostElement)`
  - `unmount()`

Eso hace que el acoplamiento sea mínimo: el Remote se “inyecta” dentro del DOM del Shell.

---

## 0) Datos que la IA debe pedirte (o decidir con defaults)

Antes de hacer cambios, la IA debe definir:

- **`REMOTE_ID`**: string único, ej: `financiero`, `reportes`, `kpis`
- **Selector del remoto** (único): `app-<REMOTE_ID>-mfe` (ej: `app-financiero-mfe`)
- **Puertos DEV** (solo si quieres dev con proxy):
  - **Proxy público**: 420N (ej: 4203)
  - **Dev-server interno**: 420N+1 (ej: 4204)
- **Ruta en Shell**: `routePath` (ej: `financiero`)

---

## 1) Requisitos (versiones recomendadas)

- Node 20+
- Angular 21
- TypeScript (idealmente \(>= 5.9 < 6.0\))
- Native Federation: `@angular-architects/native-federation` ^18.2.0
- `es-module-shims`

---

## 2) Instalar librerías (Remote)

En la raíz del Remote, asegurar (como `devDependencies`):

- `@angular-architects/native-federation`
- `@angular-devkit/build-angular`
- `es-module-shims`
- (si no existen) `@angular/cli`, `@angular/build`, `@angular/compiler-cli`

Comando recomendado:

```bash
npm install --legacy-peer-deps
```

> Nota: en algunos proyectos AI Studio aparece `"type": "module"` en `package.json`.  
> **Para este setup, quítalo** (o el `federation.config.js` puede romper por `require`).

---

## 3) Selector único (CRÍTICO)

Si tu root component usa `selector: 'app-root'`, cámbialo a un selector único:

- `selector: 'app-<REMOTE_ID>-mfe'`

Luego en `index.html`, cambia:

- `<app-root></app-root>`
- por `<app-<REMOTE_ID>-mfe></app-<REMOTE_ID>-mfe>`

Esto evita choque con el Shell (que casi siempre usa `app-root`).

---

## 4) Crear/ajustar archivos MF en `src/` (Remote)

### 4.1 `src/main.ts`

Crear (o reemplazar) con:

```ts
import('./bootstrap').catch((err) => console.error(err));
```

### 4.2 `src/mount.ts`

Crear con una API estable de montaje:

```ts
import { ApplicationRef, provideZonelessChangeDetection } from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';

let appRef: ApplicationRef | null = null;
let componentRef: { destroy(): void } | null = null;

export async function mount(host: Element) {
  unmount();
  appRef = await createApplication({
    providers: [provideZonelessChangeDetection()],
  });
  componentRef = appRef.bootstrap(AppComponent as any, host);
}

export function unmount() {
  try {
    componentRef?.destroy();
  } finally {
    componentRef = null;
    appRef?.destroy();
    appRef = null;
  }
}
```

### 4.3 `src/bootstrap.ts`

Crear con:

- exporta `mount/unmount`
- hace `bootstrapApplication(...)` SOLO si existe el selector del Remote en el DOM

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { AppComponent } from './app.component';

export { mount, unmount } from './mount';

const selectorExists = document.querySelector('app-<REMOTE_ID>-mfe');
if (selectorExists) {
  bootstrapApplication(AppComponent, {
    providers: [provideZonelessChangeDetection()],
  }).catch((err) => console.error(err));
}
```

> La IA debe reemplazar literalmente `app-<REMOTE_ID>-mfe` por el selector real (ej: `app-financiero-mfe`).

### 4.4 `src/remote-entry.ts` (opcional)

Crear:

```ts
export { AppComponent } from './app.component';
```

---

## 5) Crear `federation.config.js` (Remote)

En la raíz del proyecto Remote, crear `federation.config.js`:

```js
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: '<REMOTE_ID>',

  exposes: {
    './Bootstrap': './src/bootstrap.ts',
    './Mount': './src/mount.ts',
    './Component': './src/remote-entry.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

  skip: ['rxjs/ajax', 'rxjs/fetch', 'rxjs/testing', 'rxjs/webSocket'],
});
```

La IA debe reemplazar `<REMOTE_ID>` por el ID real.

---

## 6) Ajustar `angular.json` (Remote)

### Objetivo
Tener dos “builds”:

- `app:esbuild:*` (Angular normal, rápido, **no se cuelga**)
- `app:build:*` (Native Federation wrapper que referencia el `target` esbuild)

### Recomendación práctica (la que usamos aquí)

- Crear `architect.esbuild` con `@angular/build:application`
- `architect.build` usa `@angular-architects/native-federation:build` pero SOLO con `target`
- `serve` sigue siendo `@angular/build:dev-server` apuntando a `app:esbuild:*`

---

## 7) `remoteEntry.json` para DEV vs PROD

### 7.1 DEV (recomendado): proxy dinámico (sin editar chunks)

- El Remote levanta:
  - dev-server interno (ej: 4204)
  - proxy público (ej: 4203) que sirve `GET /remoteEntry.json` con el chunk actual

Esto requiere un `dev-proxy.mjs` similar al de este repo.

### 7.2 PROD / AI Studio (no hay proxy): generar `remoteEntry.json` desde el build

Problema: el chunk cambia en cada build (ej: `chunk-ABCD1234.js`).

Solución: después del build, correr un “postbuild” que:

- lee `dist/main*.js`
- extrae el `chunk-XXXX.js` del `import("./chunk-XXXX.js")`
- escribe `remoteEntry.json` con `outFileName: "chunk-XXXX.js"`

En este repo el generador es:
- `tools/generate-remote-entry.mjs`

---

## 8) Scripts recomendados en `package.json` (Remote)

Agregar:

- **Para PROD (AI Studio)**:
  - `mf:build`: `ng run app:esbuild:production`
  - `mf:postbuild`: `node ../tools/generate-remote-entry.mjs --dist dist --name <REMOTE_ID> --out remoteEntry.json`

- **Para DEV (opcional)**:
  - `mf:serve:ng`: `ng serve --port <DEV_SERVER_PORT>`
  - `mf:serve`: `node ./dev-proxy.mjs`

### Importante: `remoteEntry.json` dentro de `dist/`

Para que sea “deployable” (AI Studio / server estático), el archivo final debe vivir en:

- `dist/remoteEntry.json`

La forma más simple:

- Después de `mf:postbuild`, copiar:
  - `remoteEntry.json` -> `dist/remoteEntry.json`

En Windows:

```bash
copy remoteEntry.json dist\\remoteEntry.json
```

---

## 9) Parche automático (Angular 21 + Native Federation 18.2.x)

Si el builder NF falla por imports internos movidos (Tailwind / dev-server options), este repo incluye:

- `tools/patch-native-federation.mjs`

Recomendación: agregar en `package.json` del Remote:

- `postinstall`: `node ../tools/patch-native-federation.mjs`

---

## 10) Registrar el Remote en el Shell (1 solo cambio)

En el Shell edita:

- `backoffice-shell/src/assets/enable-mf.json`

Agrega una entrada:

- `id`: `<REMOTE_ID>`
- `displayName`: texto para el sidebar
- `routePath`: ej `financiero`
- `remoteEntry`: URL a `remoteEntry.json` (dev o prod)
- `mountModule`: `./Bootstrap`
- `enabled`: `true`

---

## 11) Verificación (lo que la IA debe pedirte comprobar)

### DEV
- `http://localhost:<proxy>/remoteEntry.json` responde 200 y contiene el chunk
- El Shell carga `/<routePath>` sin errores

### PROD / AI Studio
- `dist/` contiene `main-*.js` y `chunk-*.js`
- `dist/remoteEntry.json` existe
- El `outFileName` del remoteEntry existe dentro de `dist/`
- Desde el navegador:
  - `<URL_PUBLICA>/remoteEntry.json` responde 200
  - `<URL_PUBLICA>/<chunk-XXXX.js>` responde 200



