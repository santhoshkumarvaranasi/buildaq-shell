import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface UserContext {
  userId: string;
  email?: string;
  name?: string;
  tenantId?: string;
  roles?: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userContextSubject = new BehaviorSubject<UserContext | null>(null);
  public userContext$ = this.userContextSubject.asObservable();

  private readonly AUTH_TOKEN_KEY = 'auth_token';
  private readonly TENANT_KEY = 'tenant_id';

  constructor(private http: HttpClient) {
    this.initializeUserContext();
  }

  async login(username: string, password: string, tenant?: string): Promise<void> {
    const payload: any = { username, password };
    if (tenant) payload.tenant = tenant;
    const resp: any = await this.http.post('/api/auth/login', payload).toPromise();
    if (!resp || !resp.token) throw new Error('Invalid login response');

    localStorage.setItem(this.AUTH_TOKEN_KEY, resp.token);
    if (resp.tenant) localStorage.setItem(this.TENANT_KEY, resp.tenant);

    // set user context from token payload or call /api/auth/me
    const ctx = this.parseToken(resp.token);
    this.userContextSubject.next({ userId: ctx.sub || ctx.sub || '', tenantId: ctx.tenant, name: ctx.name });
  }

  async logout(): Promise<void> {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    localStorage.removeItem(this.TENANT_KEY);
    this.userContextSubject.next(null);
  }

  async getAccessToken(): Promise<string | null> {
    return localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  getUserContext(): UserContext | null {
    return this.userContextSubject.value;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  private initializeUserContext(): void {
    const token = localStorage.getItem(this.AUTH_TOKEN_KEY);
    if (!token) return;
    try {
      const payload = this.parseToken(token);
      this.userContextSubject.next({ userId: payload.sub, tenantId: payload.tenant, name: payload.name });
    } catch (e) {
      console.warn('Failed to parse token during initialization', e);
      localStorage.removeItem(this.AUTH_TOKEN_KEY);
    }
  }

  private parseToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return {};
      const payload = parts[1];
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodeURIComponent(escape(json)));
    } catch (e) {
      return {};
    }
  }
}