import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { provideRouter, Routes } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { OnboardingComponent } from './components/onboarding/onboarding.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'onboarding', component: OnboardingComponent },
  { path: '**', redirectTo: 'home' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));

