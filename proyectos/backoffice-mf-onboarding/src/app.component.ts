import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingService } from './services/onboarding.service';
import { StepperComponent } from './components/stepper/stepper.component';
import { CustomerStepComponent } from './components/steps/customer-step.component';
import { BusinessStepComponent } from './components/steps/business-step.component';
import { ProductStepComponent } from './components/steps/product-step.component';
import { ReviewStepComponent } from './components/steps/review-step.component';

@Component({
  selector: 'app-root',
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
export class AppComponent {
  onboardingService = inject(OnboardingService);
  step = this.onboardingService.currentStep;

  restart() {
    this.onboardingService.reset();
  }
}