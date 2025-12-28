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

