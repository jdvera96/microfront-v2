import { InjectionToken } from '@angular/core';

export interface MfNavConfig {
  show?: boolean;
  badge?: string;
}

export interface MicrofrontendConfig {
  /** Nombre del remote (clave usada por Native Federation) */
  id: string;
  /** Nombre visible en el sidebar */
  displayName: string;
  /** Segmento de ruta (ej: "onboarding") */
  routePath: string;
  /** URL al remoteEntry.json (idealmente vía proxy dev en 4201) */
  remoteEntry: string;
  /** Módulo expuesto a cargar (ej: "./Bootstrap") */
  mountModule?: string;
  enabled?: boolean;
  nav?: MfNavConfig;
}

export interface EnableMfConfig {
  version: number;
  microfrontends: MicrofrontendConfig[];
}

export const ENABLE_MF_CONFIG = new InjectionToken<EnableMfConfig>('ENABLE_MF_CONFIG');


