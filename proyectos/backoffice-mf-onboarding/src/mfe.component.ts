// Componente específico para ser consumido como Microfrontend
// Este componente tiene el mismo contenido que AppComponent pero sin ejecutar bootstrap
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingService } from './services/onboarding.service';
import { StepperComponent } from './components/stepper/stepper.component';
import { CustomerStepComponent } from './components/steps/customer-step.component';
import { BusinessStepComponent } from './components/steps/business-step.component';
import { ProductStepComponent } from './components/steps/product-step.component';
import { ReviewStepComponent } from './components/steps/review-step.component';

@Component({
  selector: 'app-mfe-root',
  standalone: true,
  imports: [
    CommonModule, 
    StepperComponent,
    CustomerStepComponent,
    BusinessStepComponent,
    ProductStepComponent,
    ReviewStepComponent
  ],
  templateUrl: './app.component.html'
})
export class MfeComponent {
  step;

  constructor(public onboardingService: OnboardingService) {
    this.step = this.onboardingService.currentStep;
  }

  restart() {
    this.onboardingService.reset();
  }
}

