import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="dashboard-container">
      <section class="hero">
        <div>
          <p class="eyebrow">Multi-domain shell</p>
          <h1>Welcome to BuildAQ</h1>
          <p class="lede">Launch and monitor all BuildAQ apps from one control surface.</p>
          <div class="cta-row">
            <a class="btn-primary" routerLink="/schools/dashboard">Open Schools</a>
            <a class="btn-primary ghost" routerLink="/healthcare/dashboard">Open Healthcare</a>
            <a class="btn-primary ghost" routerLink="/pharmacy/visual-mapper">Open Pharmacy</a>
            <a class="btn-primary ghost" routerLink="/apartments/dashboard">Open Apartments</a>
          </div>
        </div>

        <div class="hero-metrics">
          <div class="metric">
            <div class="metric-label">Active domains</div>
            <div class="metric-value">{{ activeDomainCount }}</div>
            <div class="metric-meta">Schools, Healthcare, Pharmacy, Apartments</div>
          </div>
          <div class="metric">
            <div class="metric-label">Shell version</div>
            <div class="metric-value">v1.0</div>
            <div class="metric-meta">Module federation enabled</div>
          </div>
        </div>
      </section>

      <section>
        <h2 class="section-title">Domain apps</h2>
        <div class="domain-cards">
          @for (app of domainApps; track app.name) {
            <div class="domain-card" [class.disabled]="!app.live">
              <div class="domain-icon">{{ app.icon }}</div>
              <div class="domain-header">
                <h3>{{ app.name }}</h3>
                <p>{{ app.description }}</p>
              </div>
              <div class="domain-actions">
                @if (app.route) {
                  <a class="btn-primary" [class.ghost]="!app.live" [routerLink]="app.route">{{ app.cta }}</a>
                } @else {
                  <button class="btn-secondary" disabled>{{ app.cta }}</button>
                }
                <span class="tag" [class.success]="app.live" [class.info]="!app.live">{{ app.live ? 'Live' : 'Queued' }}</span>
              </div>
            </div>
          }
        </div>
      </section>

      <section>
        <h2 class="section-title">Other apps</h2>
        <div class="domain-cards">
          @for (app of otherApps; track app.name) {
            <div class="domain-card" [class.disabled]="!app.live">
              <div class="domain-icon">{{ app.icon }}</div>
              <div class="domain-header">
                <h3>{{ app.name }}</h3>
                <p>{{ app.description }}</p>
              </div>
              <div class="domain-actions">
                @if (app.url) {
                  <a class="btn-primary ghost" [href]="app.url" target="_blank" rel="noopener">{{ app.cta }}</a>
                } @else {
                  <button class="btn-secondary" disabled>{{ app.cta }}</button>
                }
                <span class="tag" [class.success]="app.live" [class.muted]="!app.live">{{ app.live ? 'Available' : 'Planned' }}</span>
              </div>
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .section-title {
      margin: 0 0 0.75rem 0;
      color: var(--color-text);
      font-size: 1.15rem;
      font-weight: 700;
    }

    .hero {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 1rem;
      align-items: center;
      background: var(--color-background);
      border: 1px solid var(--color-border);
      border-radius: 16px;
      padding: 1.75rem;
    }

    .hero-metrics {
      display: grid;
      gap: 0.75rem;
    }

    .metric {
      background: var(--color-background);
      border: 1px solid var(--color-border);
      border-radius: 12px;
      padding: 0.9rem 1rem;
    }

    .metric-label { font-size: 0.85rem; color: var(--color-text-hint); }
    .metric-value { font-size: 1.6rem; font-weight: 700; color: var(--color-text); }
    .metric-meta { font-size: 0.9rem; color: var(--color-text-hint); }

    .eyebrow { text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.78rem; color: var(--color-text-hint); margin: 0 0 0.25rem 0; }
    h1 { color: var(--color-primary-500); margin: 0 0 0.35rem 0; }
    .lede { color: var(--color-text); margin: 0 0 0.75rem 0; }
    .cta-row { display: flex; gap: 0.6rem; flex-wrap: wrap; }

    .btn-primary, .btn-secondary {
      padding: 0.55rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-weight: 600;
    }

    .btn-primary {
      background: var(--color-primary-500);
      color: var(--color-basic-900);
      text-decoration: none;
    }

    .btn-primary.ghost {
      background: transparent;
      color: var(--color-primary-500);
      border: 1px solid var(--color-primary-500);
      text-decoration: none;
    }

    .btn-secondary {
      background: var(--color-basic-400);
      color: var(--color-basic-900);
      cursor: not-allowed;
      text-decoration: none;
    }

    .domain-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1rem;
    }

    .domain-card {
      padding: 1.5rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      background: var(--color-background);
      display: grid;
      grid-template-columns: auto 1fr;
      grid-template-rows: auto auto;
      grid-column-gap: 0.75rem;
      grid-row-gap: 0.35rem;
      align-items: center;
    }

    .domain-card.disabled { opacity: 0.65; }

    .domain-icon {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--color-basic-400);
      display: grid;
      place-items: center;
      font-size: 1.1rem;
      grid-row: span 2;
    }

    .domain-header h3 {
      margin: 0;
      color: var(--color-text);
    }

    .domain-header p {
      margin: 0.1rem 0 0 0;
      color: var(--color-text-hint);
      font-size: 0.95rem;
    }

    .domain-actions {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .tag {
      padding: 0.2rem 0.55rem;
      border-radius: 999px;
      font-size: 0.85rem;
      border: 1px solid;
    }

    .tag.success { border-color: var(--color-success-500); color: var(--color-success-500); background: var(--color-basic-200); }
    .tag.info { border-color: var(--color-info-500); color: var(--color-info-500); background: var(--color-basic-200); }
    .tag.muted { border-color: var(--color-basic-500); color: var(--color-basic-600); background: var(--color-basic-200); }
  `]
})
export class DashboardComponent {
  readonly domainApps = [
    {
      name: 'Schools Management',
      description: 'Manage educational institutions, students, and staff',
      icon: '🏫',
      cta: 'Open Schools',
      route: '/schools/dashboard',
      live: true,
    },
    {
      name: 'Healthcare System',
      description: 'Healthcare management and patient operations',
      icon: '🏥',
      cta: 'Open Healthcare',
      route: '/healthcare/dashboard',
      live: true,
    },
    {
      name: 'Pharmacy Operations',
      description: 'Visual mapper, products, and order flows',
      icon: 'PH',
      cta: 'Open Pharmacy',
      route: '/pharmacy/visual-mapper',
      live: true,
    },
    {
      name: 'Apartments Management',
      description: 'Residents, units, maintenance, and dues',
      icon: '🏢',
      cta: 'Open Apartments',
      route: '/apartments/dashboard',
      live: true,
    },
  ];

  readonly otherApps = [
    {
      name: 'Politician Hub',
      description: 'Campaign and engagement workflows',
      icon: '🗳️',
      cta: 'Planned',
      url: '',
      live: false,
    },
    {
      name: 'BuildAQ Chat',
      description: 'Realtime chat app and relay integration',
      icon: '💬',
      cta: 'Open Chat',
      url: 'https://chat.buildaq.com',
      live: true,
    },
    {
      name: 'BuildAQ Website',
      description: 'Public portal and platform overview',
      icon: '🌐',
      cta: 'Open Website',
      url: 'https://buildaq.com',
      live: true,
    },
    {
      name: 'BuildAQ Mobile',
      description: 'Mobile client app',
      icon: '📱',
      cta: 'Planned',
      url: '',
      live: false,
    },
  ];

  get activeDomainCount(): number {
    return this.domainApps.filter((app) => app.live).length;
  }
}
