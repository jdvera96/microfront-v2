import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

type MountExports = {
  mount?: (host: Element) => Promise<void> | void;
  unmount?: () => void;
};

@Component({
  selector: 'app-remote-mount-page',
  standalone: true,
  template: `
    <div class="flex flex-col h-full w-full bg-white">
      <div class="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">{{ title() }}</h1>
          <p class="text-sm text-gray-500 mt-1">Microfrontend (Native Federation)</p>
        </div>
      </div>

      <div class="flex-1 relative bg-gray-50 overflow-hidden">
        @if (isLoading()) {
          <div class="absolute inset-0 flex items-center justify-center z-10 bg-white/80 backdrop-blur-sm">
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p class="mt-4 text-gray-500 font-medium">Cargando...</p>
            </div>
          </div>
        }

        <div #mfeHost class="w-full h-full"></div>
      </div>
    </div>
  `,
})
export class RemoteMountPageComponent implements AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);

  @ViewChild('mfeHost', { read: ElementRef })
  mfeHost?: ElementRef<HTMLElement>;

  isLoading = signal(true);

  // data viene desde el route config
  remoteName = computed(() => this.route.snapshot.data['remoteName'] as string);
  mountModule = computed(() => (this.route.snapshot.data['mountModule'] as string) || './Bootstrap');
  title = computed(() => (this.route.snapshot.data['title'] as string) || this.remoteName());

  private _unmount?: () => void;

  async ngAfterViewInit() {
    try {
      const exports = (await loadRemoteModule(this.remoteName(), this.mountModule())) as MountExports;
      if (typeof exports.mount !== 'function') {
        throw new TypeError(`remote.mount is not a function (remote=${this.remoteName()}, module=${this.mountModule()})`);
      }
      await exports.mount(this.mfeHost!.nativeElement);
      this._unmount = exports.unmount;
    } finally {
      this.isLoading.set(false);
    }
  }

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


