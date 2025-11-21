import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="login-page">
    <div class="login-card">
      <h2>Sign in</h2>
      <form (ngSubmit)="submit()">
        <label>Domain</label>
        <input type="text" [(ngModel)]="domain" name="domain" placeholder="example.buildaq.com" />
        <label>Username</label>
        <input type="text" [(ngModel)]="username" name="username" placeholder="username" />
        <label>Password</label>
        <input type="password" [(ngModel)]="password" name="password" placeholder="password" />
        <p class="small">Signing into tenant inferred from this host: <strong>{{domain || '(none)'}}</strong></p>
        <label class="visually-hidden">Domain (inferred)</label>
        <!-- domain is shown but not editable to encourage host-based login -->
        <input type="hidden" [(ngModel)]="domain" name="domain" />
        <div class="actions">
          <button type="submit">Sign in</button>
        </div>
      </form>
      <div *ngIf="error" class="error">{{error}}</div>
    </div>
  </div>
  `,
  styles: [
    `.login-page{display:flex;align-items:center;justify-content:center;height:70vh}.login-card{width:360px;padding:20px;border-radius:8px;background:#fff;box-shadow:0 6px 24px rgba(0,0,0,0.08)}.login-card h2{margin:0 0 12px}.login-card input{width:100%;padding:8px 10px;margin:8px 0;border:1px solid #ddd;border-radius:6px}.actions{display:flex;justify-content:flex-end;margin-top:12px}.error{color:#c00;margin-top:8px}`
  ]
})
export class LoginComponent {
  username = '';
  password = '';
  domain = '';
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) {
    try {
      // infer host (no port) and normalize to lower-case
      this.domain = (window.location.hostname || '').toLowerCase();

      // Development helpers:
      // - allow override via URL query `?tenant=demo.buildaq.com`
      // - allow local dev on localhost/127.0.0.1 by mapping to a demo tenant
      const urlParams = new URLSearchParams(window.location.search || '');
      const override = urlParams.get('tenant') || (localStorage.getItem('tenant_override') || '');
      if (override) {
        this.domain = override.toLowerCase();
      } else if (this.domain === 'localhost' || this.domain === '127.0.0.1') {
        // map local dev host to demo tenant domain so login works when running locally
        this.domain = 'demo.buildaq.com';
      }
    } catch (e) {
      this.domain = '';
    }
  }

  private isValidDomain(d: string) {
    if (!d) return false;
    // Accept localhost and IPv4 loopback for dev, or a normal domain with at least one dot
    if (d === 'localhost' || d === '127.0.0.1') return true;
    const re = /^(?=.{3,255}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)(\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;
    return re.test(d);
  }

  async submit() {
    try {
      this.error = null;

      if (!this.isValidDomain(this.domain)) {
        this.error = 'Unable to infer a valid tenant domain from the host. Please access the app using your tenant subdomain.';
        return;
      }

      // Pass inferred domain to backend; backend will also accept Host-based lookup
      await this.auth.login(this.username, this.password, this.domain || undefined);
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
      this.router.navigateByUrl(returnUrl);
    } catch (e: any) {
      this.error = e?.message || 'Login failed';
    }
  }
}
