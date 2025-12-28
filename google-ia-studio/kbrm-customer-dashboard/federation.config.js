const { withNativeFederation, shareAll, DEFAULT_SKIP_LIST } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'kbrm-customer-dashboard',
  exposes: {
    './Bootstrap': './src/bootstrap.ts',
    './Mount': './src/mount.ts',
    './Component': './src/remote-entry.ts'
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' })
  },
  skip: [
    ...DEFAULT_SKIP_LIST,
    // Node-only / no-share en browser
    '@google/genai',
    'google-auth-library',
    'ws',
    '@angular/cli/bin'
  ]
});


