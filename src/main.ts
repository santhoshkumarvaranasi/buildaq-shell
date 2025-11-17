import { initFederation } from '@angular-architects/native-federation';

initFederation()
  .catch(err => console.error('Federation init failed:', err))
  .then(_ => import('./bootstrap'))
  .catch(err => console.error('Bootstrap failed:', err));
