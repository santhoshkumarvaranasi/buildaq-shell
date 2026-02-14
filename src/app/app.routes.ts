import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

const fallbackRoutes = [
  { path: '**', loadComponent: () => import('./remote-fallback/remote-fallback.component').then(c => c.RemoteFallbackComponent) }
];

function loadRemote(remoteName: string, exposedModule: string, exportName: string) {
  return () =>
    loadRemoteModule({ remoteName, exposedModule })
      .then((m: any) => m[exportName])
      .catch((err: any) => {
        console.error(`Failed to load ${remoteName} remote:`, err);
        return fallbackRoutes;
      });
}

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/login/login.component').then(c => c.LoginComponent) },
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent) },
  { path: 'schools', loadChildren: loadRemote('schools', './SchoolsModule', 'SchoolsModule') },
  { path: 'healthcare', loadChildren: loadRemote('healthcare', './HealthcareModule', 'HealthcareModule') },
  { path: 'apartments', loadChildren: loadRemote('apartments', './ApartmentsModule', 'ApartmentsModule') },
  { path: 'pharmacy', loadChildren: loadRemote('pharmacy', './Module', 'PharmacyModule') },
  { path: '**', redirectTo: '/dashboard' }
];
