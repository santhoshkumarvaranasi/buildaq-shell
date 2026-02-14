import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AuthService, UserContext } from '../core/services/auth.service';
import { filter } from 'rxjs/operators';

interface NavChild {
  label: string;
  route: string;
  icon?: string;
  external?: boolean;
}

interface NavGroup {
  id: string;
  label: string;
  icon?: string;
  children: NavChild[];
}

const REMOTE_NAMES: Record<string, string> = {
  schools: 'School Management',
  healthcare: 'Healthcare Management',
  apartments: 'Apartments Management',
  pharmacy: 'Pharmacy Operations'
};

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
  showSidebar = false;
  activeRemote: string | null = null;
  openGroups: Record<string, boolean> = {};

  private remoteMenus: Record<string, NavGroup[]> = {
    schools: [
      {
        id: 'admissions',
        label: 'Admissions',
        icon: '🧾',
        children: [
          { label: 'Dashboard', route: '/schools/dashboard', icon: '🏛️' },
          { label: 'Admissions', route: '/schools/admissions', icon: '🧾' }
        ]
      },
      {
        id: 'academics',
        label: 'Academics',
        icon: '🎓',
        children: [
          { label: 'Students', route: '/schools/students', icon: '👥' },
          { label: 'Teachers', route: '/schools/teachers', icon: '🧑‍🏫' },
          { label: 'Attendance', route: '/schools/attendance', icon: '✅' },
          { label: 'Timetable', route: '/schools/timetable', icon: '🗓️' },
          { label: 'Exams', route: '/schools/exams', icon: '🧮' },
          { label: 'Performance', route: '/schools/performance', icon: '📈' },
          { label: 'Staffing', route: '/schools/staffing', icon: '🗂️' }
        ]
      },
      {
        id: 'studentcare',
        label: 'Student Care',
        icon: '💙',
        children: [
          { label: 'Behavior', route: '/schools/behavior', icon: '⚠️' },
          { label: 'Parents', route: '/schools/parents', icon: '👪' },
          { label: 'Health', route: '/schools/health', icon: '🩺' },
          { label: 'Clubs', route: '/schools/clubs', icon: '🎯' }
        ]
      },
      {
        id: 'operations',
        label: 'Operations',
        icon: '🛠️',
        children: [
          { label: 'Library', route: '/schools/library', icon: '📚' },
          { label: 'Transport', route: '/schools/transport', icon: '🚌' },
          { label: 'Assets', route: '/schools/assets', icon: '💾' },
          { label: 'Resources', route: '/schools/resources', icon: '🧰' }
        ]
      },
      {
        id: 'communication',
        label: 'Communication',
        icon: '💬',
        children: [
          { label: 'Announcements', route: '/schools/announcements', icon: '📣' },
          { label: 'Events', route: '/schools/events', icon: '🎉' },
          { label: 'Notifications', route: '/schools/notifications', icon: '🔔' },
          { label: 'Analytics', route: '/schools/analytics', icon: '📊' }
        ]
      },
      {
        id: 'finance',
        label: 'Finance',
        icon: '💰',
        children: [
          { label: 'Fees', route: '/schools/fees', icon: '💳' },
          { label: 'Receipts', route: '/schools/fees/receipts', icon: '🧾' },
          { label: 'Reminders', route: '/schools/fees/reminders', icon: '⏰' },
          { label: 'Discounts', route: '/schools/fees/discounts', icon: '🏷️' }
        ]
      }
    ],
    healthcare: [
      {
        id: 'overview',
        label: 'Overview',
        icon: '🏥',
        children: [
          { label: 'Dashboard', route: '/healthcare/dashboard', icon: '🏥' },
          { label: 'Patients', route: '/healthcare/patients', icon: '🧑‍⚕️' },
          { label: 'Appointments', route: '/healthcare/appointments', icon: '📅' },
          { label: 'Clinical Notes', route: '/healthcare/clinical-notes', icon: '📝' }
        ]
      },
      {
        id: 'operations',
        label: 'Operations',
        icon: '🛠️',
        children: [
          { label: 'Bed Management', route: '/healthcare/beds', icon: '🛏️' },
          { label: 'Inventory', route: '/healthcare/inventory', icon: '📦' },
          { label: 'Staffing', route: '/healthcare/staffing', icon: '🧑‍⚕️' }
        ]
      },
      {
        id: 'billing',
        label: 'Billing',
        icon: '💳',
        children: [
          { label: 'Claims', route: '/healthcare/claims', icon: '🧾' },
          { label: 'Payments', route: '/healthcare/payments', icon: '💰' },
          { label: 'Reminders', route: '/healthcare/reminders', icon: '⏰' }
        ]
      },
      {
        id: 'communication',
        label: 'Communication',
        icon: '💬',
        children: [
          { label: 'Announcements', route: '/healthcare/announcements', icon: '📣' },
          { label: 'Notifications', route: '/healthcare/notifications', icon: '🔔' }
        ]
      }
    ],
    apartments: [
      {
        id: 'overview',
        label: 'Overview',
        icon: 'apt',
        children: [
          { label: 'Dashboard', route: '/apartments/dashboard', icon: 'apt' },
          { label: 'Residents', route: '/apartments/residents', icon: 'res' },
          { label: 'Units', route: '/apartments/units', icon: 'unit' },
          { label: 'Maintenance', route: '/apartments/maintenance', icon: 'mnt' },
          { label: 'Amenities', route: '/apartments/amenities', icon: 'amn' },
          { label: 'Dues & Payments', route: '/apartments/dues', icon: 'due' },
          { label: 'Announcements', route: '/apartments/announcements', icon: 'ann' }
        ]
      }
    ],
    pharmacy: [
      {
        id: 'pharmacy-ops',
        label: 'Operations',
        icon: 'Rx',
        children: [
          { label: 'Visual Mapper', route: '/pharmacy/visual-mapper', icon: 'V' },
          { label: 'Products', route: '/pharmacy/products', icon: 'P' },
          { label: 'Orders', route: '/pharmacy/orders', icon: 'O' },
          { label: 'Shelf Management', route: '/pharmacy/shelf-management', icon: 'S' },
          { label: 'Medicine Detection', route: '/pharmacy/medicine-detection', icon: 'D' }
        ]
      }
    ]
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.userContext$
      .pipe(takeUntil(this.destroy$))
      .subscribe(userContext => {
        this.userContext = userContext;
      });

    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(event => {
        const url = (event as NavigationEnd).urlAfterRedirects || (event as NavigationEnd).url;
        this.showSidebar = !this.isDashboardRoute(url);
        this.updateActiveRemote(url);
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
  closeMobileMenu(): void {
    if (this.isMobileViewport()) {
      this.isMobileMenuOpen = false;
    }
  }

  @HostListener('document:keydown.escape') handleEscapeKey(): void { this.closeMobileMenu(); }

  onChildClick(childRoute: string, external?: boolean): void {
    if (external) {
      window.open(childRoute, '_blank', 'noopener');
      return;
    }
    this.router.navigate([childRoute]);
    this.showSidebar = true;
    if (this.isMobileViewport()) {
      this.closeMobileMenu();
    }
  }

  get activeRemoteName(): string {
    return this.activeRemote ? REMOTE_NAMES[this.activeRemote] || 'Remote App' : '';
  }

  get currentMenu(): NavGroup[] {
    return this.activeRemote ? this.remoteMenus[this.activeRemote] || [] : [];
  }

  toggleGroup(id: string): void {
    this.openGroups[id] = !this.openGroups[id];
  }

  private isDashboardRoute(url: string): boolean {
    return url === '/' || url.startsWith('/dashboard') || url.startsWith('/login');
  }

  private updateActiveRemote(url: string): void {
    const previousRemote = this.activeRemote;
    const remoteKey = Object.keys(this.remoteMenus).find(key => url.startsWith('/' + key));
    this.activeRemote = remoteKey || null;
    if (this.activeRemote !== previousRemote) {
      this.openGroups = {};
    }
  }

  private isMobileViewport(): boolean {
    return typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
  }
}
