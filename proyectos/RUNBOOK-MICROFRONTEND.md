# Runbook: Configuración de Microfrontends con Native Federation

Este documento describe los requisitos y configuraciones necesarias para habilitar la arquitectura de microfrontends usando Native Federation en Angular 21.

---

## 📋 Tabla de Contenidos

1. [Requisitos Generales](#requisitos-generales)
2. [Configuración del REMOTE (Microfrontend)](#configuración-del-remote-microfrontend)
3. [Configuración del SHELL (Host)](#configuración-del-shell-host)
4. [Ejecución y Verificación](#ejecución-y-verificación)
5. [Troubleshooting](#troubleshooting)

---

## Requisitos Generales

### Versiones
- **Node.js**: v20.x o superior
- **Angular**: v21.x
- **TypeScript**: >=5.9 <6.0
- **Native Federation**: ^18.2.0

### Dependencias Base

Ambos proyectos (Shell y Remote) deben tener instaladas:

```json
{
  "devDependencies": {
    "@angular-architects/native-federation": "^18.2.0",
    "es-module-shims": "^1.8.0"
  }
}
```

**Instalación:**
```bash
npm install --legacy-peer-deps
```

---

## Configuración del REMOTE (Microfrontend)

El Remote es el microfrontend que será consumido por el Shell.

### 1. Estructura de Archivos Requerida

```
backoffice-mf-onboarding/
├── src/
│   ├── main.ts
│   ├── bootstrap.ts
│   └── app.component.ts
├── angular.json
├── federation.config.js
├── remoteEntry.json
├── package.json
└── tsconfig.json
```

### 2. package.json

Asegurar que tenga:
```json
{
  "name": "backoffice-mf-onboarding",
  "devDependencies": {
    "@angular-architects/native-federation": "^18.2.0",
    "es-module-shims": "^1.8.0"
  }
}
```

### 3. federation.config.js

Crear en la raíz del proyecto:

```javascript
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'onboarding',  // Nombre único del remote

  exposes: {
    './Component': './src/app.component.ts',  // Componente expuesto
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
  ]
});
```

### 4. src/main.ts

```typescript
import('./bootstrap')
  .catch(err => console.error(err));
```

**IMPORTANTE:** El Remote NO debe llamar a `initFederation()`.

### 5. src/bootstrap.ts

Contiene la lógica de arranque de Angular:

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { provideRouter, Routes } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';

const routes: Routes = [
  // Tus rutas aquí
];

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
```

### 6. angular.json

```json
{
  "projects": {
    "app": {
      "architect": {
        "build": {
          "builder": "@angular-architects/native-federation:build",
          "options": {
            "outputPath": {
              "base": "./dist",
              "browser": "."
            },
            "browser": "src/main.ts",
            "tsConfig": "tsconfig.json",
            "assets": [
              {
                "glob": "**/*",
                "input": "src/assets",
                "output": "/assets"
              },
              {
                "glob": "remoteEntry.json",
                "input": ".",
                "output": "/"
              }
            ]
          }
        },
        "serve": {
          "builder": "@angular/build:dev-server",
          "options": {
            "port": 4201
          }
        }
      }
    }
  }
}
```

**Puntos clave:**
- Builder: `@angular-architects/native-federation:build`
- Serve builder: `@angular/build:dev-server` (NO native-federation:serve)
- Puerto único para cada remote (4201 en este ejemplo)
- Assets debe incluir `remoteEntry.json`

### 7. remoteEntry.json

Crear en la raíz del proyecto:

```json
{
  "name": "onboarding",
  "shared": [],
  "exposes": [
    {
      "key": "./Component",
      "outFileName": "chunk-XXXXXXXX.js"
    }
  ]
}
```

**IMPORTANTE:**
- `shared` debe ser un **array** (no objeto)
- `exposes` debe ser un **array** (no objeto)
- `outFileName` debe coincidir con el chunk generado (ver Network tab en DevTools)

### 8. tsconfig.json

```json
{
  "compilerOptions": {
    // ... configuración de TypeScript
  },
  "files": ["src/main.ts"],
  "include": ["src/**/*.ts"]
}
```

---

## Configuración del SHELL (Host)

El Shell es la aplicación principal que consume los microfrontends.

### 1. Estructura de Archivos Requerida

```
backoffice-shell/
├── src/
│   ├── main.ts
│   ├── bootstrap.ts
│   ├── app.component.ts
│   └── assets/
│       └── federation.manifest.json
├── angular.json
├── federation.config.js
├── remoteEntry.json
├── package.json
└── tsconfig.json
```

### 2. package.json

Similar al Remote:
```json
{
  "name": "backoffice-shell",
  "devDependencies": {
    "@angular-architects/native-federation": "^18.2.0",
    "es-module-shims": "^1.8.0"
  }
}
```

### 3. federation.config.js

```javascript
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
  ]
});
```

**NOTA:** El Shell NO necesita `name` ni `exposes` (solo los remotes).

### 4. src/main.ts

```typescript
import { initFederation } from '@angular-architects/native-federation';

initFederation('/assets/federation.manifest.json')
  .catch(err => console.error(err))
  .then(() => import('./bootstrap'))
  .catch(err => console.error(err));
```

**IMPORTANTE:** El Shell SÍ debe llamar a `initFederation()` antes de cargar la aplicación.

### 5. src/bootstrap.ts

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { provideRouter, Routes } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { loadRemoteModule } from '@angular-architects/native-federation';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { 
    path: 'onboarding', 
    loadComponent: () => 
      loadRemoteModule('onboarding', './Component').then((m) => m.AppComponent)
  },
  { path: '**', redirectTo: 'home' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
```

**Puntos clave:**
- Importar `loadRemoteModule` de Native Federation
- Usar `loadRemoteModule('nombre-remote', './Component')` para cargar componentes remotos
- El primer parámetro debe coincidir con el `name` del remote
- El segundo parámetro debe coincidir con el `key` en `exposes`

### 6. src/assets/federation.manifest.json

```json
{
  "onboarding": "http://localhost:4201/remoteEntry.json"
}
```

**Formato:**
```json
{
  "nombre-remote": "URL-completa-al-remoteEntry.json"
}
```

### 7. angular.json

```json
{
  "projects": {
    "app": {
      "architect": {
        "build": {
          "builder": "@angular-architects/native-federation:build",
          "options": {
            "outputPath": {
              "base": "./dist",
              "browser": "."
            },
            "browser": "src/main.ts",
            "tsConfig": "tsconfig.json",
            "assets": [
              {
                "glob": "**/*",
                "input": "src/assets",
                "output": "/assets"
              },
              {
                "glob": "remoteEntry.json",
                "input": ".",
                "output": "/"
              }
            ]
          }
        },
        "serve": {
          "builder": "@angular/build:dev-server",
          "options": {
            "port": 4200
          }
        }
      }
    }
  }
}
```

### 8. remoteEntry.json

```json
{
  "name": "shell",
  "exposes": [],
  "shared": []
}
```

**NOTA:** El Shell generalmente no expone nada, pero el archivo es necesario para compatibilidad.

---

## Ejecución y Verificación

### 1. Iniciar el Remote

```bash
cd backoffice-mf-onboarding
npm install --legacy-peer-deps
ng serve --port 4201
```

**Verificar:**
- El servidor debe iniciar en `http://localhost:4201`
- Acceder a `http://localhost:4201/remoteEntry.json` debe mostrar el JSON correcto
- NO debe haber errores en consola

### 2. Iniciar el Shell

```bash
cd backoffice-shell
npm install --legacy-peer-deps
ng serve --port 4200
```

**Verificar:**
- El servidor debe iniciar en `http://localhost:4200`
- Acceder a `http://localhost:4200/assets/federation.manifest.json` debe mostrar el manifest
- La consola NO debe mostrar errores de Federation

### 3. Probar la Integración

1. Abrir `http://localhost:4200`
2. Navegar a la ruta del remote (ej: `/onboarding`)
3. El componente del remote debe cargarse sin errores

**Verificar en DevTools:**
- En Network tab, debe verse la carga de `http://localhost:4201/remoteEntry.json`
- Debe cargar el chunk del componente remoto
- NO debe haber errores 404 o de CORS

---

## Troubleshooting

### Error: "unknown remote onboarding"

**Causa:** El manifest no está configurado correctamente o no se puede acceder.

**Solución:**
1. Verificar que `federation.manifest.json` esté en `src/assets/`
2. Verificar que `angular.json` incluya los assets correctamente
3. Verificar que la URL en el manifest sea correcta
4. Reiniciar el servidor del Shell

### Error: "Cannot find module '@angular-devkit/build-angular/src/...'"

**Causa:** Native Federation v18.2.x tiene incompatibilidades con Angular 21.

**Solución:** Parchear los archivos de node_modules:

1. **builder.js:**
```javascript
// Comentar:
// const options_1 = require("@angular-devkit/build-angular/src/builders/dev-server/options");

// Agregar:
const options_1 = {
    normalizeOptions: (context, project, options) => Promise.resolve(options)
};
```

2. **angular-esbuild-adapter.js:**
```javascript
// Comentar:
// const tailwind_1 = require("@angular-devkit/build-angular/src/utils/tailwind");

// Agregar:
const tailwind_1 = { findTailwindConfigurationFile: async () => undefined };
```

### Error: "hostInfo.shared.reduce is not a function"

**Causa:** El campo `shared` en `remoteEntry.json` es un objeto en lugar de un array.

**Solución:**
```json
{
  "shared": []  // ✅ Debe ser array
}
```

NO:
```json
{
  "shared": {}  // ❌ No debe ser objeto
}
```

### Error: 404 al cargar remoteEntry.json

**Causa:** Los assets no están configurados correctamente en `angular.json`.

**Solución:** Asegurar que en `angular.json` esté:
```json
"assets": [
  {
    "glob": "remoteEntry.json",
    "input": ".",
    "output": "/"
  }
]
```

### El componente remoto no se carga

**Checklist:**
1. ✅ Ambos servidores están corriendo
2. ✅ `remoteEntry.json` es accesible desde el navegador
3. ✅ El nombre del remote coincide en todos lados
4. ✅ El `outFileName` en `remoteEntry.json` coincide con el chunk generado
5. ✅ No hay errores de CORS
6. ✅ El `federation.manifest.json` tiene la URL correcta

---

## Checklist de Configuración

### Remote (Microfrontend)

- [ ] `package.json` tiene Native Federation
- [ ] `federation.config.js` define `name` y `exposes`
- [ ] `main.ts` solo importa `bootstrap.ts` (sin `initFederation`)
- [ ] `bootstrap.ts` contiene la lógica de Angular
- [ ] `angular.json` usa builder de Native Federation
- [ ] `angular.json` sirve `remoteEntry.json`
- [ ] `remoteEntry.json` tiene formato correcto (arrays)
- [ ] Puerto único configurado (ej: 4201)
- [ ] `tsconfig.json` incluye `src/main.ts`

### Shell (Host)

- [ ] `package.json` tiene Native Federation
- [ ] `federation.config.js` define solo `shared`
- [ ] `main.ts` llama a `initFederation()`
- [ ] `bootstrap.ts` usa `loadRemoteModule()` en rutas
- [ ] `angular.json` usa builder de Native Federation
- [ ] `angular.json` sirve assets correctamente
- [ ] `federation.manifest.json` en `src/assets/`
- [ ] `federation.manifest.json` mapea todos los remotes
- [ ] Puerto 4200 (o el principal)
- [ ] `tsconfig.json` incluye `src/main.ts`

---

## Notas Adicionales

### Puertos

- **Shell:** Puerto 4200 (estándar)
- **Remote 1:** Puerto 4201
- **Remote 2:** Puerto 4202
- **Remote N:** Puerto 420N

### URLs Limpias vs Hash

Para URLs sin `#`:
```typescript
provideRouter(routes)  // ✅ URLs limpias: /home
```

Para URLs con `#`:
```typescript
provideRouter(routes, withHashLocation())  // URLs hash: /#/home
```

### Producción

Para builds de producción, el `federation.manifest.json` debe apuntar a las URLs de producción:

```json
{
  "onboarding": "https://mi-app.com/onboarding/remoteEntry.json"
}
```

---

## Recursos

- [Native Federation Docs](https://www.npmjs.com/package/@angular-architects/native-federation)
- [Module Federation Examples](https://github.com/angular-architects/module-federation-plugin-example)
- [Angular Router](https://angular.dev/guide/routing)

---

**Fecha de creación:** Diciembre 2024  
**Versión:** 1.0  
**Última actualización:** 2024-12-27

