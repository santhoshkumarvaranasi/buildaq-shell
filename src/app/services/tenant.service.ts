import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Tenant {
  id: string;
  name: string;
  settings?: Record<string, any>;
}

@Injectable({ providedIn: 'root' })
export class TenantService {
  private _current = new BehaviorSubject<Tenant | null>(null);
  current$ = this._current.asObservable();

  constructor() {}

  setTenant(tenant: Tenant) {
    this._current.next(tenant);
  }

  getTenant(): Tenant | null {
    return this._current.getValue();
  }
}
