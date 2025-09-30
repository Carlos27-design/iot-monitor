import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '../interfaces/auth-reponse.interface';
import { User } from '../interfaces/user.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

type authStatus = 'checking' | 'authenticated' | 'not-authenticated';

const URL = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class AuthData {
  private _authStatus = signal<authStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);

  public checkStatusResource = rxResource({
    stream: () => this.checkStatus(),
  });

  public authStatus = computed(() => {
    if (this._authStatus() === 'checking') return 'checking';
    if (this._user()) return 'authenticated';
    return 'not-authenticated';
  });

  public user = computed(() => this._user());
  public token = computed(() => this._token());

  public login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${URL}/auth/login`, {
        email,
        password,
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((err: any) => this.handleAuthError(err))
      );
  }

  public register(fullName: string, email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${URL}/auth/register`, {
        fullName,
        email,
        password,
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((err: any) => this.handleAuthError(err))
      );
  }

  public checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    return this.http.get<AuthResponse>(`${URL}/auth/check-status`).pipe(
      map((resp) => this.handleAuthSuccess(resp)),
      catchError((err: any) => this.handleAuthError(err))
    );
  }

  public logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');

    localStorage.removeItem('token');
  }

  private handleAuthSuccess({ user, token }: AuthResponse) {
    this._authStatus.set('authenticated');
    this._user.set(user);
    this._token.set(token);
    localStorage.setItem('token', token);
    return true;
  }

  private handleAuthError(error: any) {
    this._authStatus.set('not-authenticated');
    this._user.set(null);
    return of(false);
  }
}
