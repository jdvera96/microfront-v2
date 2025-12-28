import { ApplicationRef, provideZonelessChangeDetection } from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';

let appRef: ApplicationRef | null = null;
let componentRef: { destroy(): void } | null = null;

/**
 * Monta el microfrontend dentro de un elemento del DOM provisto por el Shell.
 */
export async function mount(host: Element) {
  unmount();

  appRef = await createApplication({
    providers: [provideZonelessChangeDetection()],
  });

  componentRef = appRef.bootstrap(AppComponent as any, host);
}

/**
 * Desmonta el microfrontend (se llama cuando el usuario sale de la ruta).
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


