import { initFederation } from '@angular-architects/native-federation';

declare const globalThis: { ngDevMode?: boolean };

if (typeof globalThis.ngDevMode === 'undefined') {
  globalThis.ngDevMode = false;
}

const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '0.0.0.0');

const federationManifest = isLocalhost
  ? '/assets/federation.manifest.local.json'
  : '/assets/federation.manifest.prod.json';

initFederation(federationManifest)
  .then(() => import('./bootstrap'))
  .catch(err => console.error('Federation/bootstrap failed:', err));
