import { ApplicationRef } from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { MfeComponent } from './mfe.component';

let appRef: ApplicationRef | null = null;
let componentRef: { destroy(): void } | null = null;

/**
 * Monta el microfrontend dentro de un elemento del DOM provisto por el Shell.
 * Esto evita crear componentes del remoto “desde” el router del host (que puede causar NG0203).
 */
export async function mount(host: Element) {
  // Si ya había un mount previo, lo limpiamos (navegación ida/vuelta).
  unmount();

  appRef = await createApplication({
    providers: [provideZonelessChangeDetection()],
  });

  // Bootstrap del componente standalone dentro del elemento host.
  componentRef = appRef.bootstrap(MfeComponent as any, host);
}

/**
 * Desmonta el microfrontend (se llama cuando el usuario sale de /onboarding).
 */
export function unmount() {
  try {
    componentRef?.destroy();
  } finally {
    componentRef = null;
    appRef?.destroy();
    appRef = null;
  }
}


