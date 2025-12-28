import { ApplicationRef, provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';

const ROOT_SELECTOR = 'app-kbrm-customer-dashboard-mfe';

let appRef: ApplicationRef | null = null;
let currentHost: Element | null = null;

export async function mount(host: Element): Promise<ApplicationRef> {
  currentHost = host;

  let rootEl = host.querySelector(ROOT_SELECTOR);
  if (!rootEl) {
    rootEl = document.createElement(ROOT_SELECTOR);
    host.appendChild(rootEl);
  }

  if (appRef) return appRef;

  appRef = await bootstrapApplication(AppComponent, {
    providers: [provideZonelessChangeDetection()]
  });

  return appRef;
}

export function unmount(): void {
  if (appRef) {
    appRef.destroy();
    appRef = null;
  }

  if (currentHost) {
    const rootEl = currentHost.querySelector(ROOT_SELECTOR);
    if (rootEl) rootEl.remove();
  }

  currentHost = null;
}


