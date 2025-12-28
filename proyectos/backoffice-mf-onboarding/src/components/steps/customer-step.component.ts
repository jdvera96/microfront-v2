import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { OnboardingService } from '../../services/onboarding.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-step',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold text-slate-800 mb-2">Datos del Solicitante</h2>
      <p class="text-slate-500 mb-8">Información básica de contacto para el registro.</p>

      <form [formGroup]="form" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Name -->
          <div class="col-span-1 md:col-span-2">
            <label class="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
            <input 
              type="text" 
              formControlName="name"
              class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Ej. Juan Pérez"
            >
          </div>

          <!-- Doc ID -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">DNI / NIE</label>
            <input 
              type="text" 
              formControlName="docId"
              class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="12345678A"
            >
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
            <input 
              type="tel" 
              formControlName="phone"
              class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="+34 600 000 000"
            >
          </div>

          <!-- Email -->
          <div class="col-span-1 md:col-span-2">
            <label class="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              formControlName="email"
              class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="juan.perez@empresa.com"
            >
          </div>
        </div>

        <div class="flex justify-end pt-6">
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
export class CustomerStepComponent {
  form;

  constructor(
    private fb: FormBuilder,
    private onboardingService: OnboardingService
  ) {
    this.form = this.fb.group({
      name: [this.onboardingService.customerData().name, [Validators.required, Validators.minLength(3)]],
      docId: [this.onboardingService.customerData().docId, [Validators.required]],
      email: [this.onboardingService.customerData().email, [Validators.required, Validators.email]],
      phone: [this.onboardingService.customerData().phone, [Validators.required]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.onboardingService.updateCustomer(this.form.getRawValue() as any);
      this.onboardingService.nextStep();
    }
  }
}