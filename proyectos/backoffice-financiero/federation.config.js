const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'financiero',

  exposes: {
    // Para el Shell (render dentro del DOM del host)
    './Bootstrap': './src/bootstrap.ts',
    './Mount': './src/mount.ts',
    './Component': './src/remote-entry.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

  skip: ['rxjs/ajax', 'rxjs/fetch', 'rxjs/testing', 'rxjs/webSocket'],
});


