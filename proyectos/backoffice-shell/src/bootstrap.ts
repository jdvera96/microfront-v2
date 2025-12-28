import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { provideRouter, Routes } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { RemoteMountPageComponent } from './mf/remote-mount-page.component';
import { ENABLE_MF_CONFIG, EnableMfConfig } from './mf/mf-config';

function buildRoutes(cfg: EnableMfConfig): Routes {
  const mfRoutes: Routes = (cfg.microfrontends || [])
    .filter((m) => m.enabled !== false)
    .map((m) => ({
      path: m.routePath,
      component: RemoteMountPageComponent,
      data: {
        remoteName: m.id,
        mountModule: m.mountModule || './Bootstrap',
        title: m.displayName,
      },
    }));

  return [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    ...mfRoutes,
    { path: '**', redirectTo: 'home' },
  ];
}

export function bootstrapShell(cfg: EnableMfConfig) {
  const routes = buildRoutes(cfg);
  return bootstrapApplication(AppComponent, {
    providers: [
      provideZonelessChangeDetection(),
      { provide: ENABLE_MF_CONFIG, useValue: cfg },
      provideRouter(routes),
    ],
  }).catch((err) => console.error(err));
}

