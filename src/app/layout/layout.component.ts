import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NbMenuItem, NbLayoutModule, NbSidebarModule, NbMenuModule, NbUserModule, NbActionsModule, NbIconModule } from '@nebular/theme';
import { Subject, takeUntil } from 'rxjs';
import { AuthService, UserContext } from '../core/services/auth.service';
import { RemoteLoaderService } from '../core/services/remote-loader.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NbLayoutModule,
    NbSidebarModule,
    NbMenuModule,
    NbUserModule,
    NbActionsModule,
    NbIconModule
  ],
  template: `
    <nb-layout>
      <nb-layout-header fixed>
        <div class="header-container">
          <div class="logo">
            <img src="/favicon.ico" alt="BuildAQ" />
            <span class="logo-text">BuildAQ</span>
          </div>
          <div class="header-actions">
            <nb-user 
              *ngIf="userContext"
              [name]="userContext.name"
              [title]="userContext.email"
              (click)="openUserMenu()">
            </nb-user>
            <nb-actions *ngIf="!userContext">
              <nb-action (click)="login()">
                <nb-icon icon="log-in-outline"></nb-icon>
                Login
              </nb-action>
            </nb-actions>
          </div>
        </div>
      </nb-layout-header>

      <nb-layout-sidebar>
        <nb-menu [items]="menuItems"></nb-menu>
      </nb-layout-sidebar>

      <nb-layout-column>
        <div class="content-area">
          <router-outlet></router-outlet>
        </div>
      </nb-layout-column>
    </nb-layout>
  `,
  styles: [`
    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1rem;
      height: 100%;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .logo img {
      height: 32px;
    }
    
    .logo-text {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--color-primary-500);
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .content-area {
      padding: 1rem;
    }
    
    nb-layout-column {
      min-height: calc(100vh - 4rem);
    }
  `]
})
export class LayoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  userContext: UserContext | null = null;
  menuItems: NbMenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'home-outline',
      link: '/dashboard'
    },
    {
      title: 'Remote Apps',
      icon: 'grid-outline',
      children: [
        {
          title: 'Schools',
          icon: 'book-outline',
          link: '/schools'
        }
      ]
    }
  ];

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

  openUserMenu(): void {
    // Implement user menu functionality
    console.log('User menu clicked');
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