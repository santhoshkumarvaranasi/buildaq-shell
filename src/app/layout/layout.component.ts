import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AuthService, UserContext } from '../core/services/auth.service';
import { RemoteLoaderService } from '../core/services/remote-loader.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink
  ],
  template: `
    <div class="layout">
      <header class="header">
        <div class="header-container">
          <div class="logo">
            <span class="logo-text">BuildAQ Shell</span>
          </div>
          <div class="header-actions">
            <div *ngIf="userContext" class="user-info">
              Welcome, {{userContext.name}}!
              <button (click)="logout()" class="btn-logout">Logout</button>
            </div>
            <div *ngIf="!userContext">
              <button (click)="login()" class="btn-login">🔐 Login</button>
            </div>
          </div>
        </div>
      </header>

      <nav class="sidebar">
        <div class="nav-items">
          <a routerLink="/dashboard" class="nav-item">🏠 Dashboard</a>
          <a routerLink="/schools" class="nav-item">🏫 Schools</a>
          <div class="nav-section">Remote Apps</div>
          <a routerLink="/schools" class="nav-item sub-item">📚 School Management</a>
        </div>
      </nav>

      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    
    .header {
      background-color: #fff;
      border-bottom: 1px solid #e4e9f0;
      z-index: 1000;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 60px;
    }
    
    .header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1rem;
      height: 100%;
      max-width: 100%;
    }
    
    .logo {
      display: flex;
      align-items: center;
      font-size: 1.25rem;
      font-weight: 600;
      color: #2a2a2a;
    }
    
    .logo-text {
      margin-left: 0.5rem;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.875rem;
      color: #666;
    }
    
    .btn-logout, .btn-login {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
    }
    
    .btn-logout:hover, .btn-login:hover {
      background: #0056b3;
    }
    
    .sidebar {
      position: fixed;
      left: 0;
      top: 60px;
      bottom: 0;
      width: 250px;
      background-color: #f8f9fa;
      border-right: 1px solid #e4e9f0;
      padding: 1rem 0;
      overflow-y: auto;
    }
    
    .nav-items {
      display: flex;
      flex-direction: column;
    }
    
    .nav-item {
      display: block;
      padding: 0.75rem 1rem;
      color: #495057;
      text-decoration: none;
      border-bottom: 1px solid #e4e9f0;
      transition: background-color 0.2s;
    }
    
    .nav-item:hover {
      background-color: #e9ecef;
      color: #007bff;
    }
    
    .nav-section {
      padding: 0.5rem 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: #6c757d;
      background-color: #e9ecef;
    }
    
    .sub-item {
      padding-left: 2rem;
      font-size: 0.875rem;
    }
    
    .content {
      margin-left: 250px;
      margin-top: 60px;
      padding: 2rem;
      min-height: calc(100vh - 60px);
      background-color: #f8f9fa;
    }
  `]
})
export class LayoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  userContext: UserContext | null = null;

  constructor(
    private authService: AuthService,
    private remoteLoader: RemoteLoaderService
  ) {}

  ngOnInit(): void {
    this.authService.userContext$
      .pipe(takeUntil(this.destroy$))
      .subscribe(userContext => {
        this.userContext = userContext;
        if (userContext) {
          this.loadRemoteApplications();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async login(): Promise<void> {
    try {
      await this.authService.login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  private async loadRemoteApplications(): Promise<void> {
    try {
      await this.remoteLoader.loadRemotes();
      console.log('Remote applications loaded');
    } catch (error) {
      console.error('Failed to load remote applications:', error);
    }
  }
}