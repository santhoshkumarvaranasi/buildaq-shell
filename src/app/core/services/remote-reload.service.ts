import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RemoteReloadService {
  private es: EventSource | null = null;

  constructor() {
    // Only enable in development on localhost
    try {
      if (typeof window !== 'undefined' && window.location && window.location.hostname === 'localhost') {
        // REMOTE EVENTS DISABLED
        // const url = 'http://localhost:3000/assets/remote-events';
        // this.es = new EventSource(url);
        // this.es.addEventListener('reload', (ev: MessageEvent) => {
        //   try {
        //     console.log('[remote-reload] remote rebuild detected, reloading shell', ev && ev.data);
        //     // perform a full reload so new remoteEntry and assets are re-fetched
        //     window.location.reload();
        //   } catch (e) { /* ignore */ }
        // });
        // this.es.addEventListener('error', (e) => {
        //   // ignore — will retry
        //   console.warn('[remote-reload] SSE error', e);
        // });
      }
    } catch (e) {
      // ignore
    }
  }

  close() {
    try { this.es && this.es.close(); } catch (e) { /* ignore */ }
  }
}
