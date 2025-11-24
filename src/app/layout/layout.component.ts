import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AuthService, UserContext } from '../core/services/auth.service';
import { RemoteLoaderService } from '../core/services/remote-loader.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  styleUrls: ['./layout.component.scss'],
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
              <button (click)="login()" class="btn-login">Login</button>
            </div>
          </div>
        </div>
      </header>

      <div class="mobile-overlay" [class.active]="isMobileMenuOpen" (click)="closeMobileMenu()"></div>

      <nav class="sidebar" [class.open]="isMobileMenuOpen">
        <div class="nav-items">
          <a routerLink="/dashboard" class="nav-item" (click)="closeMobileMenu()">📊 Dashboard</a>
          <div class="nav-section">Remote Apps</div>
          <a routerLink="/schools" class="nav-item" (click)="closeMobileMenu()">🏫 School Management</a>
          <div class="sub-item">
            <a routerLink="/schools/admissions" class="nav-item" (click)="closeMobileMenu()">📥 Admissions</a>
            <a routerLink="/schools/students" class="nav-item" (click)="closeMobileMenu()">👨‍🎓 Students</a>
            <a routerLink="/schools/teachers" class="nav-item" (click)="closeMobileMenu()">👩‍🏫 Teachers</a>
            <a routerLink="/schools/attendance" class="nav-item" (click)="closeMobileMenu()">🕒 Attendance</a>
            <a routerLink="/schools/fees" class="nav-item" (click)="closeMobileMenu()">💳 Fees</a>
            <a routerLink="/schools/fees/receipts" class="nav-item" (click)="closeMobileMenu()">🧾 Receipts</a>
            <a routerLink="/schools/timetable" class="nav-item" (click)="closeMobileMenu()">📅 Timetable</a>
            <a routerLink="/schools/exams" class="nav-item" (click)="closeMobileMenu()">📝 Exams</a>
          </div>
        </div>
      </nav>

      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
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
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async login(): Promise<void> { this.router.navigate(['/login']); }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  toggleMobileMenu(): void { this.isMobileMenuOpen = !this.isMobileMenuOpen; }
  closeMobileMenu(): void { this.isMobileMenuOpen = false; }

  @HostListener('document:keydown.escape') handleEscapeKey(): void { this.closeMobileMenu(); }

  private async loadRemoteApplications(): Promise<void> {
    try {
      await this.remoteLoader.loadRemotes();
    } catch (error) {
      console.error('Failed to load remote applications:', error);
    }
  }
}
