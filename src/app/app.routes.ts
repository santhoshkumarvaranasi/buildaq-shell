import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent)
  },
  {
    path: 'schools',
    loadChildren: () => 
      loadRemoteModule('schools', './SchoolsModule').then(m => m.SchoolsModule).catch(err => {
        console.error('Failed to load schools remote with Native Federation:', err);
        // Fallback to dashboard
        return import('./features/dashboard/dashboard.component').then(c => ({ default: c.DashboardComponent }));
      })
  }
];
