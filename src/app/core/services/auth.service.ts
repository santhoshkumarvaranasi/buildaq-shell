import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserContext {
  userId: string;
  email: string;
  name: string;
  tenantId: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userContextSubject = new BehaviorSubject<UserContext | null>(null);
  public userContext$ = this.userContextSubject.asObservable();

  constructor() {
    this.initializeUserContext();
  }

  async login(): Promise<void> {
    try {
      // Mock authentication for now
      const mockUser: UserContext = {
        userId: '12345',
        email: 'demo@buildaq.com',
        name: 'Demo User',
        tenantId: 'buildaq-demo',
        roles: ['admin']
      };

      this.userContextSubject.next(mockUser);
      console.log('Mock login successful');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      this.userContextSubject.next(null);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  async getAccessToken(): Promise<string> {
    // Mock token for now
    return 'mock-jwt-token';
  }

  getUserContext(): UserContext | null {
    return this.userContextSubject.value;
  }

  isAuthenticated(): boolean {
    return this.userContextSubject.value !== null;
  }

  private initializeUserContext(): void {
    // Check for existing session/token
    console.log('Initializing auth context');
  }
}