const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');


const isProd = process.env.NODE_ENV === 'production' || process.env.NG_BUILD_ENV === 'production';
// In development load schools remote directly from the schools frontend dev server.
const schoolsRemote = isProd
  ? 'https://schools.buildaq.com/remoteEntry.json'
  : 'http://localhost:4201/remoteEntry.json';

const healthcareRemote = isProd
  ? 'https://healthcare.buildaq.com/remoteEntry.json'
  : 'http://localhost:4202/remoteEntry.json';

const apartmentsRemote = isProd
  ? 'https://apartments.buildaq.com/remoteEntry.json'
  : 'http://localhost:4203/remoteEntry.json';

const pharmacyRemote = isProd
  ? 'https://pharmacy.buildaq.com/remoteEntry.json'
  : 'http://localhost:4204/remoteEntry.json';

module.exports = withNativeFederation({

  remotes: {
    'schools': schoolsRemote,
    'healthcare': healthcareRemote,
    'apartments': apartmentsRemote,
    'pharmacy': pharmacyRemote,
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
