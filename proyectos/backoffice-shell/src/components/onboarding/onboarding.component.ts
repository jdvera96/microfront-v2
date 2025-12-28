import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, signal } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/native-federation';

@Component({
  selector: 'app-onboarding',
  standalone: true,
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
        
        <!-- Host DOM donde montamos el microfrontend -->
        <div #mfeHost class="w-full h-full"></div>
      </div>
    </div>
  `
})
export class OnboardingComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mfeHost', { read: ElementRef })
  mfeHost?: ElementRef<HTMLElement>;

  isLoading = signal<boolean>(true);

  async ngAfterViewInit() {
    try {
      // Cargamos el módulo bootstrap del remoto, que re-exporta mount/unmount.
      const remote = await loadRemoteModule('onboarding', './Bootstrap');
      if (typeof remote.mount !== 'function') {
        throw new TypeError('remote.mount is not a function (export faltante en remoto ./Bootstrap)');
      }
      await remote.mount(this.mfeHost!.nativeElement);
      this._unmount = remote.unmount;
    } finally {
      this.isLoading.set(false);
    }
  }

  private _unmount?: () => void;

  ngOnDestroy(): void {
    try {
      this._unmount?.();
    } catch {
      // noop
    } finally {
      this._unmount = undefined;
    }
  }
}
