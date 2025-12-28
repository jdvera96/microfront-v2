# Convertir cualquier Angular a Remote (Native Federation) — paso a paso

Objetivo: que cualquier equipo pueda “convertir” su Angular a Microfrontend Remote y que el Shell lo consuma **solo agregando 1 entrada** en `backoffice-shell/src/assets/enable-mf.json`.

> Este repo usa el patrón **RemoteMount**: el Shell no importa componentes Angular del Remote. En su lugar, carga un módulo remoto `./Bootstrap` y llama `mount(host)` / `unmount()`.

---

## 0) Requisitos

- Node 20+
- Angular 21
- TypeScript (idealmente >= 5.9 < 6.0)
- `@angular-architects/native-federation` ^18.2.0
- `es-module-shims`

---

## 1) Elegir un ID y puertos (convención)

Define:
- **`REMOTE_ID`**: nombre único (ej: `financiero`, `reportes`, `kpis`)
- **Dev-server interno**: 420N+1 (ej: 4204)
- **Proxy público**: 420N (ej: 4203)

Esto permite que el Shell siempre apunte a un `remoteEntry.json` estable en el proxy.

---

## 2) En el Remote: selector único (crítico)

Evita usar `app-root` (choca con el Shell).

- Cambia el selector del root component a algo único (ej: `app-<REMOTE_ID>-mfe`)
- Cambia `index.html` para usar ese selector

Ejemplo:
- `app.component.ts` -> `selector: 'app-financiero-mfe'`
- `index.html` -> `<app-financiero-mfe></app-financiero-mfe>`

---

## 3) Agregar archivos “MF” en `src/`

Crear:
- `src/main.ts`
- `src/bootstrap.ts` (exporta mount/unmount + bootstrap condicional)
- `src/mount.ts` (API de montaje)
- `src/remote-entry.ts` (export opcional del componente)

### `src/main.ts`

Debe ser solo:
- `import('./bootstrap')`

### `src/bootstrap.ts`

Reglas:
- Exporta `mount` y `unmount`
- Solo hace `bootstrapApplication(...)` si el selector del remoto existe en el DOM
  - Standalone: sí existe
  - Dentro del Shell: **NO** existe (y no debe bootstrapease)

### `src/mount.ts`

Implementa:
- `mount(host: Element)`
- `unmount()`

---

## 4) Native Federation config

Crear `federation.config.js` en la raíz del Remote:

- `name: '<REMOTE_ID>'`
- `exposes` mínimo:
  - `./Bootstrap` -> `./src/bootstrap.ts`

Recomendado (como este repo):
- También exponer `./Mount` y `./Component` apuntando al mismo chunk.

---

## 5) Ajustar Angular build/serve

### `angular.json`

- `build.builder`: `@angular-architects/native-federation:build`
- `build.options.browser`: `src/main.ts`
- `serve`: `@angular/build:dev-server`
- Puertos:
  - interno (dev-server): 420N+1

---

## 6) Scripts en `package.json`

Agregar:
- `mf:serve:ng`: levanta el dev-server interno
- `mf:serve`: proxy que sirve `remoteEntry.json` dinámico (dev)

---

## 7) Producción / Deploy estático (AI Studio, S3, etc.)

Problema: en prod no tienes proxy dev y el chunk cambia.

Solución recomendada: **postbuild** que genera `remoteEntry.json` leyendo el bundle generado.

En este repo existe:
- `tools/generate-remote-entry.mjs`

Agrega en el Remote:
- `mf:build`: `ng build --configuration=production`
- `mf:postbuild`: `node ../tools/generate-remote-entry.mjs --dist dist --name <REMOTE_ID> --out remoteEntry.json`

Flujo:
1) `npm run mf:build`
2) `npm run mf:postbuild`
3) Despliega `dist/` + `remoteEntry.json` (en la misma base URL)

### Nota importante (Angular 21 + Native Federation 18.2.x)

En Angular 21, Native Federation 18.2.x puede fallar en build por imports internos movidos (Tailwind / dev-server options).
Para no parchear a mano, este repo incluye:
- `tools/patch-native-federation.mjs`

Recomendación: agrega en el Remote:
- `postinstall`: `node ../tools/patch-native-federation.mjs`

---

## 8) Registrar en el Shell (1 solo cambio)

Editar `backoffice-shell/src/assets/enable-mf.json` y agregar:

- `id`: `<REMOTE_ID>`
- `routePath`: ruta en el Shell
- `remoteEntry`: URL pública donde vive el remoteEntry.json
- `mountModule`: `./Bootstrap`

Reinicia el Shell.

---

## 9) Checklist rápido

- [ ] Selector único (no `app-root`)
- [ ] `federation.config.js` con `name` y `./Bootstrap`
- [ ] `angular.json` con builder de Native Federation
- [ ] `src/main.ts` -> importa bootstrap
- [ ] `bootstrap.ts` NO bootstrapea dentro del Shell
- [ ] `enable-mf.json` tiene el remote registrado
- [ ] URL de `remoteEntry.json` responde 200


