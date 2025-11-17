const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');


const isProd = process.env.NODE_ENV === 'production' || process.env.NG_BUILD_ENV === 'production';
const schoolsRemote = isProd
  ? 'https://schools.buildaq.com/remoteEntry.json'
  : 'http://localhost:4201/remoteEntry.json';

module.exports = withNativeFederation({

  remotes: {
    'schools': schoolsRemote,
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
