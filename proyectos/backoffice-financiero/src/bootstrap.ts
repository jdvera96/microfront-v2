import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { AppComponent } from './app.component';

// API de montaje para el Shell
export { mount, unmount } from './mount';

// Standalone mode: solo bootstrap si el selector del remoto existe.
// Importante: el Shell también tiene <app-root>, por eso usamos un selector único.
const selectorExists = document.querySelector('app-financiero-mfe');

if (selectorExists) {
  bootstrapApplication(AppComponent, {
    providers: [provideZonelessChangeDetection()],
  }).catch((err) => console.error(err));
}


