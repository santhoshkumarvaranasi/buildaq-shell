import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
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
            <button class="mobile-menu-toggle" (click)="toggleMobileMenu()">
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
            </button>
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

      <!-- Mobile overlay -->
      <div class="mobile-overlay" 
           [class.active]="isMobileMenuOpen" 
           (click)="closeMobileMenu()"></div>

      <nav class="sidebar" [class.open]="isMobileMenuOpen">
        <div class="nav-items">
          <a routerLink="/dashboard" class="nav-item" (click)="closeMobileMenu()">🏠 Dashboard</a>
          <div class="nav-section">Remote Apps</div>
          <a routerLink="/schools" class="nav-item" (click)="closeMobileMenu()">🏫 School Management</a>
          <div class="sub-item">
            <a routerLink="/schools/students" class="nav-item" (click)="closeMobileMenu()">👨‍🎓 Students</a>
            <a routerLink="/schools/teachers" class="nav-item" (click)="closeMobileMenu()">👩‍🏫 Teachers</a>
            <a routerLink="/schools/attendance" class="nav-item" (click)="closeMobileMenu()">🕒 Attendance</a>
            <a routerLink="/schools/fees" class="nav-item" (click)="closeMobileMenu()">💳 Fees</a>
            <a routerLink="/schools/timetable" class="nav-item" (click)="closeMobileMenu()">📅 Timetable</a>
            <a routerLink="/schools/exams" class="nav-item" (click)="closeMobileMenu()">📝 Exams</a>
          </div>
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
    
    /* Mobile Responsiveness */
    @media (max-width: 768px) {
      .header-container {
        padding: 0 1rem;
      }
      
      .logo-text {
        font-size: 1rem;
      }
      
      .sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        z-index: 1001;
      }
      
      .sidebar.open {
        transform: translateX(0);
      }
      
      .content {
        margin-left: 0;
        padding: 1rem;
      }
      
      .nav-item {
        padding: 1rem;
        font-size: 0.9rem;
      }
      
      .user-info {
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-end;
        font-size: 0.8rem;
      }
    }
    
    /* Mobile Menu Toggle */
    .mobile-menu-toggle {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      flex-direction: column;
      justify-content: space-around;
      width: 32px;
      height: 32px;
      transition: all 0.3s ease;
    }

    .mobile-menu-toggle:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .hamburger-line {
      display: block;
      height: 3px;
      width: 20px;
      background-color: #333;
      border-radius: 1px;
      transition: all 0.3s ease;
    }

    .mobile-overlay {
      display: none;
      position: fixed;
      top: 60px;
      left: 0;
      width: 100%;
      height: calc(100vh - 60px);
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .mobile-overlay.active {
      display: block;
      opacity: 1;
    }
    
    @media (max-width: 768px) {
      .mobile-menu-toggle {
        display: flex;
      }
      
      .sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        z-index: 1001;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
      }
      
      .sidebar.open {
        transform: translateX(0);
      }
    }
  `]
})
export class LayoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  userContext: UserContext | null = null;
  isMobileMenuOpen = false;

  constructor(
    private authService: AuthService,
    private remoteLoader: RemoteLoaderService,
    private router: Router
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

    // No longer hiding shell sidebar when remote is active; leave remote and
    // shell navigation both available. The shell will deep-link into the
    // remote using /schools/* routes.
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async login(): Promise<void> {
    this.router.navigate(['/login']);
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      // Ensure user is redirected to login after logout
      try {
        this.router.navigate(['/login']);
      } catch (navErr) {
        console.warn('Navigation after logout failed:', navErr);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    this.closeMobileMenu();
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