import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(null);

  private http = inject(HttpClient);

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';

    return this._user() ? 'authenticated' : 'not-authenticated';
  });

  user = computed<User | null>(() => this._user());
  token = computed<string | null>(() => this._token());
}
