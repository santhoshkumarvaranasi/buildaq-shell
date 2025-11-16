import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export interface RemoteConfig {
  url: string;
  exposed: string;
  displayName: string;
  route: string;
  version: string;
  enabled: boolean;
}

export interface RemoteRegistry {
  [key: string]: RemoteConfig;
}

@Injectable({ providedIn: 'root' })
export class RemoteLoaderService {
  private remotes = new Map<string, any>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  async loadRemotes(): Promise<void> {
    try {
      const registry = await this.http.get<RemoteRegistry>('/assets/remotes.json').toPromise();
      
      if (registry) {
        for (const [name, config] of Object.entries(registry)) {
          if (config.enabled) {
            await this.loadRemote(name, config);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load remotes registry:', error);
    }
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
}