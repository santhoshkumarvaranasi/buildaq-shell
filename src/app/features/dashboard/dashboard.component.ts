import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="dashboard-container">
      <h1>Welcome to BuildAQ</h1>
      <p>Multi-Domain Platform Dashboard</p>
      
      <div class="domain-cards">
        <div class="domain-card">
          <h3>Schools Management</h3>
          <p>Manage educational institutions, students, and staff</p>
          <button class="btn-primary" routerLink="/schools">Open Schools App</button>
        </div>
        
        <div class="domain-card">
          <h3>Healthcare System</h3>
          <p>Coming Soon - Healthcare management platform</p>
          <button class="btn-secondary" disabled>Coming Soon</button>
        </div>
        
        <div class="domain-card">
          <h3>Real Estate Portal</h3>
          <p>Coming Soon - Property management system</p>
          <button class="btn-secondary" disabled>Coming Soon</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
    }
    
    h1 {
      color: var(--color-primary-500);
      margin-bottom: 0.5rem;
    }
    
    .domain-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }
    
    .domain-card {
      padding: 1.5rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      background: var(--color-background);
    }
    
    .domain-card h3 {
      margin-bottom: 0.5rem;
      color: var(--color-text);
    }
    
    .domain-card p {
      margin-bottom: 1rem;
      color: var(--color-text-hint);
    }
    
    .btn-primary, .btn-secondary {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
    }
    
    .btn-primary {
      background: var(--color-primary-500);
      color: white;
    }
    
    .btn-secondary {
      background: var(--color-basic-400);
      color: var(--color-text-hint);
      cursor: not-allowed;
    }
  `]
})
export class DashboardComponent { }