import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

export interface RemoteConfig {
  url: string;
  devUrl?: string;
  exposed: string;
  displayName: string;
  route: string;
  version: string;
  enabled: boolean;
  nav?: RemoteNavChild[];
}

export interface RemoteRegistry {
  [key: string]: RemoteConfig;
}

export interface RemoteNavItem {
  id: string;
  displayName: string;
  route: string;
  external: boolean;
  children?: RemoteNavChild[];
}

export interface RemoteNavChild {
  label: string;
  route: string;
  external?: boolean;
}

@Injectable({ providedIn: 'root' })
export class RemoteLoaderService {
  private remotes = new Map<string, any>();
  private navItems = new BehaviorSubject<RemoteNavItem[]>([]);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  async loadRemotes(): Promise<void> {
    try {
      const registry = await firstValueFrom(
        this.http.get<RemoteRegistry>(this.getRegistryUrl())
      );

      const navItems: RemoteNavItem[] = [];
      if (registry) {
        for (const [name, config] of Object.entries(registry)) {
          if (config.enabled) {
            // Update URL based on environment
            const environmentAwareConfig = this.getEnvironmentAwareConfig(config);
            navItems.push({
              id: name,
              displayName: environmentAwareConfig.displayName,
              route: environmentAwareConfig.route,
              external: this.isExternalRoute(environmentAwareConfig.route),
              children: environmentAwareConfig.nav
            });
            // attempt to load remote after nav is registered so nav still shows even if remote fails
            await this.loadRemote(name, environmentAwareConfig);
          }
        }
      }

      this.navItems.next(navItems);
    } catch (error) {
      console.error('Failed to load remotes registry:', error);
    }
  }

  getNavItems() {
    return this.navItems.asObservable();
  }

  private getRegistryUrl(): string {
    // Serve the registry from the shell's own assets path
    return `${window.location.origin}/assets/remotes.json`;
  }

  private getEnvironmentAwareConfig(config: RemoteConfig): RemoteConfig {
    if ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && config.devUrl) {
      return { ...config, url: config.devUrl };
    }
    return config;
  }

  private async loadRemote(name: string, config: RemoteConfig): Promise<void> {
    try {
      console.log(`Loading remote: ${name} from ${config.url}`);
      
      // For now, just log the remote configuration
      // Actual dynamic loading would be implemented here
      this.remotes.set(name, { config });
      
      console.log(`Successfully configured remote: ${name}`);
    } catch (error) {
      console.error(`Failed to load remote ${name}:`, error);
      this.handleRemoteLoadError(name, error);
    }
  }

  private handleRemoteLoadError(name: string, error: any): void {
    console.error(`Remote ${name} failed to load:`, error);
    // Could show user-friendly error message or fallback UI
  }

  getRemote(name: string): any {
    return this.remotes.get(name);
  }

  getLoadedRemotes(): string[] {
    return Array.from(this.remotes.keys());
  }

  private isExternalRoute(route: string): boolean {
    return /^https?:\/\//i.test(route);
  }
}
