import { Component, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  template: `
    <div class="flex flex-col h-full w-full bg-white">
      <!-- Header for the MF context -->
      <div class="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Onboarding</h1>
          <p class="text-sm text-gray-500 mt-1">Microfrontend Module v1.0.0</p>
        </div>
        <div class="flex items-center gap-2">
           <span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full border border-green-200 flex items-center gap-1">
             <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             Remote Connected
           </span>
        </div>
      </div>

      <!-- Microfrontend Container -->
      <div class="flex-1 relative bg-gray-50 overflow-hidden">
        @if (isLoading()) {
          <div class="absolute inset-0 flex items-center justify-center z-10 bg-white/80 backdrop-blur-sm">
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p class="mt-4 text-gray-500 font-medium">Loading remote module...</p>
            </div>
          </div>
        }
        
        <iframe 
          [src]="safeUrl()" 
          class="w-full h-full border-0 shadow-inner"
          title="Onboarding Microfrontend"
          (load)="onLoad()">
        </iframe>
      </div>
    </div>
  `
})
export class OnboardingComponent {
  private sanitizer = inject(DomSanitizer);
  
  // URL provided for the microfrontend
  private readonly REMOTE_URL = 'https://backoffice-mf-onboarding-83864446244.us-west1.run.app';
  
  // Create a safe resource URL for the iframe
  safeUrl = signal<SafeResourceUrl>(
    this.sanitizer.bypassSecurityTrustResourceUrl(this.REMOTE_URL)
  );

  isLoading = signal<boolean>(true);

  onLoad() {
    this.isLoading.set(false);
  }
}
