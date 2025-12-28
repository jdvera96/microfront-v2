import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/native-federation';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  // El elemento <app-onboarding-mfe> lo agrega/usa el remoto en runtime.
  // En build-time Angular no lo conoce, así que lo declaramos como custom element.
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="flex flex-col h-full w-full bg-white">
      <!-- Header for the MF context -->
      <div class="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Onboarding</h1>
          <p class="text-sm text-gray-500 mt-1">Microfrontend (Native Federation)</p>
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
              <p class="mt-4 text-gray-500 font-medium">Cargando onboarding...</p>
            </div>
          </div>
        }
        
        <!-- IMPORTANTE: el remoto bootstrapea dentro de este selector -->
        <app-onboarding-mfe class="block w-full h-full"></app-onboarding-mfe>
      </div>
    </div>
  `
})
export class OnboardingComponent implements AfterViewInit {
  isLoading = signal<boolean>(true);

  async ngAfterViewInit() {
    try {
      // Al importar este módulo expuesto, el remoto ejecuta su bootstrap (si detecta el selector).
      await loadRemoteModule('onboarding', './Bootstrap');
    } finally {
      this.isLoading.set(false);
    }
  }
}
