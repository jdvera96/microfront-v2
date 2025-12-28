// Este archivo exporta el componente para ser consumido como microfrontend
// NO hace bootstrap, solo exporta la clase del componente MFE
export { MfeComponent as AppComponent } from './mfe.component';

// Forzar rebuild del chunk
export const MFE_VERSION = '1.0.3';

