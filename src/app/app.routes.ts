
import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

import { authGuard } from './core/services/auth.guard';
// Dynamically determine remoteEntry URL based on environment
const isProd = typeof ngDevMode === 'undefined' || !ngDevMode;
// In development use the backend-proxied manifest so the shell doesn't depend
// on direct access to the MF static server (4201).
const remoteEntryUrl = isProd
  ? 'https://schools.buildaq.com/remoteEntry.js'
  : 'http://localhost:3000/assets/remoteEntry.json';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/login/login.component').then(c => c.LoginComponent) },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent)
  },
  {
    path: 'schools',
    canActivate: [authGuard],
    loadChildren: () => 
      loadRemoteModule({
        remoteEntry: remoteEntryUrl,
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
