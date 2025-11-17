const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({

  remotes: {
    'schools': process.env['NODE_ENV'] === 'production' 
      ? 'https://schools.buildaq.com'
      : 'http://localhost:4201',
  },

  shared: shareAll({ 
    singleton: true, 
    strictVersion: false, 
    requiredVersion: 'auto',
    pinToShared: false
  }),

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
    // Add further packages you don't need at runtime
  ],

  // Please read our FAQ about sharing libs:
  // https://shorturl.at/jmzH0

  features: {
    // New feature for more performance and avoiding
    // issues with node libs. Comment this out to
    // get the traditional behavior:
    ignoreUnusedDeps: true
  }
  
});
