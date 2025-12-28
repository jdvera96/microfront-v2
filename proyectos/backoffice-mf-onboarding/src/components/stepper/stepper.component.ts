import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full py-6">
      <div class="flex items-center justify-between relative z-10">
        @for (step of steps; track step.number) {
          <div class="flex flex-col items-center flex-1 relative">
            
            <!-- Connector Line -->
            @if (!$first) {
              <div 
                class="absolute top-4 right-1/2 w-full h-0.5 -z-10 transition-colors duration-500"
                [class.bg-blue-600]="currentStep() >= step.number"
                [class.bg-slate-200]="currentStep() < step.number"
              ></div>
            }

            <!-- Circle -->
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2"
              [class.bg-blue-600]="currentStep() >= step.number"
              [class.border-blue-600]="currentStep() >= step.number"
              [class.text-white]="currentStep() >= step.number"
              [class.bg-white]="currentStep() < step.number"
              [class.border-slate-300]="currentStep() < step.number"
              [class.text-slate-500]="currentStep() < step.number"
            >
              @if (currentStep() > step.number) {
                <!-- Checkmark -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              } @else {
                {{ step.number }}
              }
            </div>

            <!-- Label -->
            <span 
              class="text-xs mt-2 font-medium transition-colors duration-300 hidden sm:block"
              [class.text-blue-700]="currentStep() >= step.number"
              [class.text-slate-400]="currentStep() < step.number"
            >
              {{ step.label }}
            </span>
          </div>
        }
      </div>
    </div>
  `
})
export class StepperComponent {
  currentStep = input.required<number>();
  
  steps = [
    { number: 1, label: 'Solicitante' },
    { number: 2, label: 'Negocio' },
    { number: 3, label: 'Producto' },
    { number: 4, label: 'Confirmar' }
  ];
}