import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter([], withHashLocation())
  ]
}).catch((err) => console.error(err));

