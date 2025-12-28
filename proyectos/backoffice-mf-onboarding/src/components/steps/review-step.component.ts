import { Component, inject, signal } from '@angular/core';
import { OnboardingService } from '../../services/onboarding.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-step',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold text-slate-800 mb-6">Resumen del Contrato</h2>

      <!-- Summary Cards -->
      <div class="bg-white border border-slate-200 rounded-xl overflow-hidden mb-6 shadow-sm">
        
        <!-- Customer Section -->
        <div class="p-6 border-b border-slate-100">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-slate-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
              Datos del Cliente
            </h3>
            <button (click)="goToStep(1)" class="text-xs text-blue-600 font-medium hover:underline">Editar</button>
          </div>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="block text-slate-400 text-xs uppercase tracking-wider">Nombre</span>
              <span class="text-slate-700 font-medium">{{ customer().name }}</span>
            </div>
            <div>
              <span class="block text-slate-400 text-xs uppercase tracking-wider">DNI/NIE</span>
              <span class="text-slate-700 font-medium">{{ customer().docId }}</span>
            </div>
            <div>
              <span class="block text-slate-400 text-xs uppercase tracking-wider">Email</span>
              <span class="text-slate-700 font-medium">{{ customer().email }}</span>
            </div>
          </div>
        </div>

        <!-- Business Section -->
        <div class="p-6 border-b border-slate-100 bg-slate-50/50">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-slate-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" clip-rule="evenodd" />
              </svg>
              Empresa
            </h3>
            <button (click)="goToStep(2)" class="text-xs text-blue-600 font-medium hover:underline">Editar</button>
          </div>
          <div class="grid grid-cols-2 gap-4 text-sm">
             <div>
              <span class="block text-slate-400 text-xs uppercase tracking-wider">Razón Social</span>
              <span class="text-slate-700 font-medium">{{ business().companyName }}</span>
            </div>
            <div>
              <span class="block text-slate-400 text-xs uppercase tracking-wider">CIF</span>
              <span class="text-slate-700 font-medium">{{ business().cif }}</span>
            </div>
            <div class="col-span-2">
              <span class="block text-slate-400 text-xs uppercase tracking-wider">Dirección</span>
              <span class="text-slate-700 font-medium">{{ business().address }}</span>
            </div>
          </div>
        </div>

        <!-- Product Section -->
        <div class="p-6 bg-slate-900 text-slate-100">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
              </svg>
              Conexión Única
            </h3>
            <button (click)="goToStep(3)" class="text-xs text-blue-400 font-medium hover:underline">Editar</button>
          </div>
          
          <div class="flex items-center justify-between mb-4">
            <span class="text-2xl font-bold">{{ product().speed }}</span>
            <span class="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium border border-blue-500/30">Fibra Óptica</span>
          </div>

          <div class="space-y-2 border-t border-slate-700 pt-4 text-sm">
            <div class="flex justify-between">
              <span class="text-slate-400">IP Fija</span>
              <span>{{ product().staticIp ? 'Sí (+15€)' : 'No' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">SLA Premium</span>
              <span>{{ product().slaPremium ? 'Sí (+25€)' : 'No' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Consent -->
      <div class="mb-8">
        <label class="flex items-start gap-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
          <input type="checkbox" class="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" (change)="toggleTerms($event)">
          <span class="text-sm text-slate-600">
            Confirmo que los datos son correctos y acepto los <a href="#" class="text-blue-600 hover:underline">Términos y Condiciones</a> del servicio Conexión Única. Entiendo que la contratación implica compromiso de permanencia de 12 meses.
          </span>
        </label>
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
          (click)="onComplete()"
          [disabled]="!termsAccepted()"
          class="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md flex items-center gap-2"
        >
          @if(isSubmitting()) {
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Contratando...
          } @else {
            Confirmar Contratación
          }
        </button>
      </div>
    </div>
  `
})
export class ReviewStepComponent {
  private onboardingService = inject(OnboardingService);
  
  customer = this.onboardingService.customerData;
  business = this.onboardingService.businessData;
  product = this.onboardingService.productData;

  termsAccepted = signal(false);
  isSubmitting = signal(false);

  toggleTerms(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.termsAccepted.set(checked);
  }

  goToStep(step: number) {
    this.onboardingService.goToStep(step);
  }

  onBack() {
    this.onboardingService.prevStep();
  }

  onComplete() {
    this.isSubmitting.set(true);
    // Simulate API call
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.onboardingService.nextStep(); // Goes to step 5 (success)
    }, 2000);
  }
}