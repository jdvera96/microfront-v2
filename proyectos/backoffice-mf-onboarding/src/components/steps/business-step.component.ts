import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { OnboardingService } from '../../services/onboarding.service';
import { GeminiService } from '../../services/gemini.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-business-step',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="max-w-2xl mx-auto">
      <div class="flex justify-between items-start mb-6">
        <div>
          <h2 class="text-2xl font-bold text-slate-800 mb-1">Datos del Negocio</h2>
          <p class="text-slate-500">Detalles legales y ubicación de la empresa.</p>
        </div>
        
        <!-- AI Magic Button -->
        <button 
          type="button"
          (click)="autofillWithAI()"
          [disabled]="isLoading()"
          class="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs rounded-full shadow hover:shadow-md transition-all disabled:opacity-70"
        >
          @if (isLoading()) {
            <svg class="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Generando...</span>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            <span>Autocompletar con IA</span>
          }
        </button>
      </div>

      <form [formGroup]="form" class="space-y-6">
        
        <!-- Company Name -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Razón Social / Nombre Empresa</label>
          <div class="relative">
             <input 
              type="text" 
              formControlName="companyName"
              class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Ej. Tecnologías Innovadoras S.L."
            >
            <div class="absolute right-3 top-2.5 text-slate-400">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <p class="text-xs text-slate-400 mt-1">Escribe un nombre y pulsa "Autocompletar con IA" para probar.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- CIF -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">CIF / NIF</label>
            <input 
              type="text" 
              formControlName="cif"
              class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="B12345678"
            >
          </div>

          <!-- Sector -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Sector Actividad</label>
            <input 
              type="text" 
              formControlName="sector"
              class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Tecnología"
            >
          </div>
        </div>

        <!-- Address -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Dirección Fiscal</label>
          <textarea 
            formControlName="address"
            rows="3"
            class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Calle Principal 123, 28001 Madrid"
          ></textarea>
        </div>

        <div class="flex justify-between pt-6 border-t border-slate-100 mt-6">
          <button 
            type="button"
            (click)="onBack()"
            class="px-6 py-2 bg-white text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            Atrás
          </button>
          
          <button 
            type="button"
            (click)="onSubmit()"
            [disabled]="form.invalid"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
          >
            Continuar
          </button>
        </div>
      </form>
    </div>
  `
})
export class BusinessStepComponent {
  private fb = inject(FormBuilder);
  private onboardingService = inject(OnboardingService);
  private geminiService = inject(GeminiService);

  isLoading = signal(false);
  
  form = this.fb.group({
    companyName: [this.onboardingService.businessData().companyName, [Validators.required]],
    cif: [this.onboardingService.businessData().cif, [Validators.required]],
    address: [this.onboardingService.businessData().address, [Validators.required]],
    sector: [this.onboardingService.businessData().sector, [Validators.required]]
  });

  async autofillWithAI() {
    const name = this.form.get('companyName')?.value;
    if (!name && !confirm('¿Generar datos para una empresa aleatoria?')) return;

    this.isLoading.set(true);
    try {
      const data = await this.geminiService.generateBusinessData(name || 'Acme Corp');
      if (data) {
        this.form.patchValue({
          cif: data.cif,
          address: data.address,
          sector: data.sector
        });
        if (!name) this.form.patchValue({ companyName: 'Empresa Generada S.L.' });
      }
    } catch (e) {
      alert('Error al contactar con la IA. Inténtalo de nuevo.');
    } finally {
      this.isLoading.set(false);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.onboardingService.updateBusiness(this.form.getRawValue() as any);
      this.onboardingService.nextStep();
    }
  }

  onBack() {
    this.onboardingService.prevStep();
  }
}