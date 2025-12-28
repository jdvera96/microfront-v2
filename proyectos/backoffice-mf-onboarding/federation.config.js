const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({

  name: 'onboarding',

  exposes: {
    // Para el Shell (render dentro del DOM del host):
    // Importar este módulo ejecuta `bootstrap.ts` (con guard por selector).
    './Bootstrap': './src/bootstrap.ts',

    // Mantener expuesto el componente para escenarios alternativos
    './Component': './src/remote-entry.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
    // Add other packages that you don't want to share or generally upgrade
  ]

});

