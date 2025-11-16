import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent)
  },
  {
    path: 'schools',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent)
    // Note: Schools remote will be loaded here when available
    // loadChildren: () => import('schools/SchoolsModule').then(m => m.SchoolsModule)
  }
];
