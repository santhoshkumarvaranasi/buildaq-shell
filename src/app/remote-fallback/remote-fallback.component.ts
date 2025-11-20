import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-remote-fallback',
  template: `
    <div style="padding:24px; text-align:center;">
      <h2>Feature temporarily unavailable</h2>
      <p>The requested feature couldn't be loaded right now. Please try again later.</p>
    </div>
  `
})
export class RemoteFallbackComponent {}
