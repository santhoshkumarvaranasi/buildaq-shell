const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');


const isProd = process.env.NODE_ENV === 'production' || process.env.NG_BUILD_ENV === 'production';
// In development prefer fetching the MF manifest through the backend proxy
// which runs on port 3000 (the orchestrator exposes /assets/*). This
// avoids direct cross-port fetch issues or firewall blocking of 4201.
const schoolsRemote = isProd
  ? 'https://schools.buildaq.com/remoteEntry.json'
  : 'http://localhost:3000/assets/remoteEntry.json';

module.exports = withNativeFederation({

  remotes: {
    'schools': schoolsRemote,
    'health': schoolsRemote,
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
