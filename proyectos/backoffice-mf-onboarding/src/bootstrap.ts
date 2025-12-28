import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';

// IMPORTANTE:
// - Este archivo participa en el chunk "bootstrap" que hoy estás referenciando en `remoteEntry.json`.
// - El Shell usa `loadRemoteModule(...).then(m => m.AppComponent)`.
// - Para que eso funcione, este chunk DEBE exportar un símbolo llamado `AppComponent`.
//
// Por eso, exportamos el componente MFE (sin bootstrap) como `AppComponent`:
export { MfeComponent as AppComponent } from './mfe.component';

// En modo standalone (http://localhost:4201) sí queremos bootstrapping sobre el selector.
import { AppComponent as StandaloneAppComponent } from './app.component';

// Solo hacer bootstrap si el selector existe en el DOM (standalone mode).
// Cuando se carga como remoto dentro del Shell, ese selector NO existe y NO debe hacer bootstrap.
const selectorExists = document.querySelector('app-onboarding-mfe');

if (selectorExists) {
  bootstrapApplication(StandaloneAppComponent, {
    providers: [
      provideZonelessChangeDetection()
    ]
  }).catch((err) => console.error(err));
}

