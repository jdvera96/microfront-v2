import { Component, inject } from '@angular/core';
import { OnboardingService } from '../../services/onboarding.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-step',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold text-slate-800 mb-2">Configuración "Conexión Única"</h2>
      <p class="text-slate-500 mb-8">Personaliza las características técnicas de tu conexión.</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        @for (speed of speeds; track speed.value) {
          <button 
            type="button"
            (click)="selectSpeed(speed.value)"
            class="relative p-6 rounded-xl border-2 text-left transition-all duration-300 hover:shadow-lg group"
            [class.border-blue-600]="currentProduct().speed === speed.value"
            [class.bg-blue-50]="currentProduct().speed === speed.value"
            [class.border-slate-200]="currentProduct().speed !== speed.value"
            [class.bg-white]="currentProduct().speed !== speed.value"
          >
            @if(currentProduct().speed === speed.value) {
              <div class="absolute -top-3 -right-3 bg-blue-600 text-white p-1 rounded-full shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            }
            
            <div class="text-3xl font-bold mb-2" [class.text-blue-600]="currentProduct().speed === speed.value" [class.text-slate-800]="currentProduct().speed !== speed.value">{{ speed.label }}</div>
            <div class="text-sm text-slate-500 mb-4">{{ speed.desc }}</div>
            <div class="text-lg font-semibold text-slate-800">{{ speed.price }}€ <span class="text-xs font-normal text-slate-500">/mes</span></div>
          </button>
        }
      </div>

      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
        <h3 class="font-semibold text-slate-800 mb-4">Extras Disponibles</h3>
        <div class="space-y-4">
          
          <!-- Static IP -->
          <div class="flex items-center justify-between p-4 rounded-lg border border-slate-100 hover:border-blue-100 transition-colors cursor-pointer" (click)="toggleStaticIp()">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <div>
                <div class="font-medium text-slate-800">IP Fija Estática</div>
                <div class="text-sm text-slate-500">Esencial para servidores y accesos remotos seguros.</div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <span class="font-semibold text-slate-700">+15€</span>
              <div class="w-12 h-6 rounded-full p-1 transition-colors duration-300" 
                   [class.bg-blue-600]="currentProduct().staticIp" 
                   [class.bg-slate-200]="!currentProduct().staticIp">
                <div class="w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300"
                     [class.translate-x-6]="currentProduct().staticIp"></div>
              </div>
            </div>
          </div>

          <!-- SLA -->
          <div class="flex items-center justify-between p-4 rounded-lg border border-slate-100 hover:border-blue-100 transition-colors cursor-pointer" (click)="toggleSla()">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <div class="font-medium text-slate-800">SLA Premium</div>
                <div class="text-sm text-slate-500">Soporte prioritario y garantía de disponibilidad 99.9%.</div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <span class="font-semibold text-slate-700">+25€</span>
              <div class="w-12 h-6 rounded-full p-1 transition-colors duration-300" 
                   [class.bg-blue-600]="currentProduct().slaPremium" 
                   [class.bg-slate-200]="!currentProduct().slaPremium">
                <div class="w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300"
                     [class.translate-x-6]="currentProduct().slaPremium"></div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div class="flex justify-between pt-6 border-t border-slate-100">
        <button 
          type="button"
          (click)="onBack()"
          class="px-6 py-2 bg-white text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
        >
          Atrás
        </button>
        
        <button 
          type="button"
          (click)="onNext()"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
        >
          Continuar
        </button>
      </div>
    </div>
  `
})
export class ProductStepComponent {
  private onboardingService = inject(OnboardingService);
  
  currentProduct = this.onboardingService.productData;

  speeds = [
    { value: '300Mb', label: '300 Mb', desc: 'Ideal para pequeñas oficinas.', price: '39' },
    { value: '600Mb', label: '600 Mb', desc: 'Equilibrio perfecto velocidad/precio.', price: '49' },
    { value: '1Gb', label: '1 Gb', desc: 'Máxima potencia para tu negocio.', price: '59' }
  ];

  selectSpeed(speed: string) {
    this.onboardingService.updateProduct({ speed });
  }

  toggleStaticIp() {
    this.onboardingService.updateProduct({ staticIp: !this.currentProduct().staticIp });
  }

  toggleSla() {
    this.onboardingService.updateProduct({ slaPremium: !this.currentProduct().slaPremium });
  }

  onNext() {
    this.onboardingService.nextStep();
  }

  onBack() {
    this.onboardingService.prevStep();
  }
}