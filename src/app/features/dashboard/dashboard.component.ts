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
          <p class="lede">Launch domain apps from one control surface.</p>
          <div class="cta-row">
            <a class="btn-primary" routerLink="/schools">🏫 Open Schools</a>
            <a class="btn-primary ghost" routerLink="/healthcare">🏥 Open Healthcare</a>
          </div>
        </div>
        <div class="hero-metrics">
          <div class="metric">
            <div class="metric-label">Active domains</div>
            <div class="metric-value">2</div>
            <div class="metric-meta">Schools, Healthcare</div>
          </div>
          <div class="metric">
            <div class="metric-label">Shell version</div>
            <div class="metric-value">v1.0</div>
            <div class="metric-meta">Module federation enabled</div>
          </div>
        </div>
      </section>

      <div class="domain-cards">
        <div class="domain-card">
          <div class="domain-icon">🏫</div>
          <div class="domain-header">
            <h3>Schools Management</h3>
            <p>Manage educational institutions, students, and staff</p>
          </div>
          <div class="domain-actions">
            <a class="btn-primary" routerLink="/schools/dashboard">Open Schools</a>
            <span class="tag success">Live</span>
          </div>
        </div>
        
        <div class="domain-card">
          <div class="domain-icon">🏥</div>
          <div class="domain-header">
            <h3>Healthcare System</h3>
            <p>Healthcare management platform</p>
          </div>
          <div class="domain-actions">
            <a class="btn-primary ghost" routerLink="/healthcare/dashboard">Open Healthcare</a>
            <span class="tag info">Preview</span>
          </div>
        </div>
        
        <div class="domain-card disabled">
          <div class="domain-icon">🏠</div>
          <div class="domain-header">
            <h3>Real Estate Portal</h3>
            <p>Coming Soon - Property management system</p>
          </div>
          <div class="domain-actions">
            <button class="btn-secondary" disabled>Coming Soon</button>
            <span class="tag muted">Queued</span>
          </div>
        </div>

        <div class="domain-card">
          <div class="domain-icon">🏢</div>
          <div class="domain-header">
            <h3>Apartments Management</h3>
            <p>Residents, units, maintenance, dues</p>
          </div>
          <div class="domain-actions">
            <a class="btn-primary ghost" routerLink="/apartments/dashboard">Open Apartments</a>
            <span class="tag info">Preview</span>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .hero {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 1rem;
      align-items: center;
      background: linear-gradient(135deg, #eef2ff, #e0f7ff);
      border: 1px solid var(--color-border);
      border-radius: 16px;
      padding: 1.75rem;
    }

    .hero-metrics {
      display: grid;
      gap: 0.75rem;
    }

    .metric {
      background: #fff;
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
      color: #0b1021;
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
      color: #0b1021;
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
      background: #eef2ff;
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
    .tag.success { border-color: #22c55e; color: #16a34a; background: #ecfdf3; }
    .tag.info { border-color: #0ea5e9; color: #0284c7; background: #e0f2fe; }
    .tag.muted { border-color: #cbd5e1; color: #94a3b8; background: #f8fafc; }

    .domain-card h3 {
      margin-bottom: 0.25rem;
    }
    
    .domain-card p {
      margin-bottom: 1rem;
      color: var(--color-text-hint);
    }
  `]
})
export class DashboardComponent { }
