
import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

import { authGuard } from './core/services/auth.guard';

const isProd = typeof ngDevMode === 'undefined' || !ngDevMode;
const schoolsRemoteEntry = isProd
  ? 'https://schools.buildaq.com/remoteEntry.json'
  : 'http://localhost:4201/remoteEntry.json';
const healthcareRemoteEntry = isProd
  ? 'https://healthcare.buildaq.com/remoteEntry.json'
  : 'http://localhost:4202/remoteEntry.json';
const apartmentsRemoteEntry = isProd
  ? 'https://apartments.buildaq.com/remoteEntry.json'
  : 'http://localhost:4203/remoteEntry.json';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/login/login.component').then(c => c.LoginComponent) },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent)
  },
  {
    path: 'healthcare',
    loadChildren: () => 
      loadRemoteModule({
        remoteEntry: healthcareRemoteEntry,
        exposedModule: './HealthcareModule'
      }).then(m => m.HealthcareModule).catch(err => {
        console.error('Failed to load healthcare remote with Native Federation:', err);
        return Promise.resolve([
          { path: '**', loadComponent: () => import('./remote-fallback/remote-fallback.component').then(c => c.RemoteFallbackComponent) }
        ]);
      })
  },
  {
    path: 'apartments',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: apartmentsRemoteEntry,
        exposedModule: './ApartmentsModule'
      }).then(m => m.ApartmentsModule).catch(err => {
        console.error('Failed to load apartments remote with Native Federation:', err);
        return Promise.resolve([
          { path: '**', loadComponent: () => import('./remote-fallback/remote-fallback.component').then(c => c.RemoteFallbackComponent) }
        ]);
      })
  },
  {
    path: 'schools',
    loadChildren: () => 
      loadRemoteModule({
        remoteEntry: schoolsRemoteEntry,
        exposedModule: './SchoolsModule'
      }).then(m => m.SchoolsModule).catch(err => {
        console.error('Failed to load schools remote with Native Federation:', err);
        // Fallback to a small local component explaining the problem
        return Promise.resolve([
          { path: '', loadComponent: () => import('./remote-fallback/remote-fallback.component').then(c => c.RemoteFallbackComponent) }
        ]);
      })
  },
  // Wildcard route to catch all unknown paths and redirect to dashboard
  { path: '**', redirectTo: '/dashboard' }
];
