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
      loadRemoteModule({
        remoteEntry: 'http://localhost:4201/remoteEntry.json',
        exposedModule: './SchoolsModule'
      }).then(m => m.SchoolsModule).catch(err => {
        console.error('Failed to load schools remote with Native Federation:', err);
        // Return a proper routes array fallback instead of component
        return Promise.resolve([]);
      })
  }
];
