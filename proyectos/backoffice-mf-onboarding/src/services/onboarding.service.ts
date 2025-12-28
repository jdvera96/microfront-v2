import { Injectable, signal, computed } from '@angular/core';

export interface OnboardingState {
  step: number;
  customer: {
    name: string;
    docId: string;
    email: string;
    phone: string;
  };
  business: {
    companyName: string;
    cif: string;
    address: string;
    sector: string;
  };
  product: {
    speed: string;
    staticIp: boolean;
    slaPremium: boolean;
  };
}

const INITIAL_STATE: OnboardingState = {
  step: 1,
  customer: { name: '', docId: '', email: '', phone: '' },
  business: { companyName: '', cif: '', address: '', sector: '' },
  product: { speed: '300Mb', staticIp: false, slaPremium: false }
};

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  // Main state signal
  private state = signal<OnboardingState>(INITIAL_STATE);

  // Selectors
  readonly currentStep = computed(() => this.state().step);
  readonly customerData = computed(() => this.state().customer);
  readonly businessData = computed(() => this.state().business);
  readonly productData = computed(() => this.state().product);

  // Actions
  nextStep() {
    this.state.update(s => ({ ...s, step: Math.min(s.step + 1, 5) }));
  }

  prevStep() {
    this.state.update(s => ({ ...s, step: Math.max(s.step - 1, 1) }));
  }

  goToStep(step: number) {
    this.state.update(s => ({ ...s, step }));
  }

  updateCustomer(data: Partial<OnboardingState['customer']>) {
    this.state.update(s => ({ ...s, customer: { ...s.customer, ...data } }));
  }

  updateBusiness(data: Partial<OnboardingState['business']>) {
    this.state.update(s => ({ ...s, business: { ...s.business, ...data } }));
  }

  updateProduct(data: Partial<OnboardingState['product']>) {
    this.state.update(s => ({ ...s, product: { ...s.product, ...data } }));
  }

  reset() {
    this.state.set(INITIAL_STATE);
  }
}