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
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  userContext: UserContext | null = null;
  isMobileMenuOpen = false;
  openGroups: Record<string, boolean> = {
    admissions: false,
    academics: false,
    studentcare: false,
    operations: false,
    communication: false,
    finance: false
  };

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
  toggleGroup(key: string): void { this.openGroups[key] = !this.openGroups[key]; }

  @HostListener('document:keydown.escape') handleEscapeKey(): void { this.closeMobileMenu(); }

  private async loadRemoteApplications(): Promise<void> {
    try {
      await this.remoteLoader.loadRemotes();
    } catch (error) {
      console.error('Failed to load remote applications:', error);
    }
  }
}
