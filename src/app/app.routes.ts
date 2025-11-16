import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent)
  },
  {
    path: 'schools',
    loadChildren: () => 
      loadRemoteModule({
        type: 'module',
        remoteEntry: window.location.hostname === 'shell.buildaq.com' 
          ? 'https://schools.buildaq.com/remoteEntry.js'
          : 'http://localhost:4201/remoteEntry.js',
        exposedModule: './SchoolsModule'
      }).then(m => m.SchoolsModule).catch(err => {
        console.error('Failed to load schools remote:', err);
        // Fallback to dashboard
        return import('./features/dashboard/dashboard.component').then(c => ({ default: c.DashboardComponent }));
      })
  }
];
