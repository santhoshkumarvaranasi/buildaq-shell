import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _token: string | null = null;

  constructor() {}

  setToken(token: string) {
    this._token = token;
    // Persist to sessionStorage for simple dev persistence
    try { sessionStorage.setItem('auth_token', token); } catch {}
  }

  getToken(): string | null {
    if (!this._token) {
      try { this._token = sessionStorage.getItem('auth_token'); } catch {}
    }
    return this._token;
  }

  clear() {
    this._token = null;
    try { sessionStorage.removeItem('auth_token'); } catch {}
  }
}
