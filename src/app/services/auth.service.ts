import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IAuthority, ILoginResponse, IRoleType, IUser } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken: string | null = null;
  private user: IUser | null = null;

  constructor(private http: HttpClient, private router: Router) {
    this.load();
  }

  public register(user: IUser): Observable<any> {
    return this.http.post('users', user).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error al registrar el usuario:', error);
    return throwError('Ocurrió un error al registrar el usuario.');
}

  public getToken(): string | null {
    return this.accessToken;
  }

  public getAccessToken(): string | null {
    return this.accessToken; // Devuelve el token de acceso
  }

  private load(): void {
    const token = localStorage.getItem('access_token');
    if (token) this.accessToken = JSON.parse(token);

    const user = localStorage.getItem('auth_user');
    if (user) this.user = JSON.parse(user);
  }

  public login(credentials: { email: string; password: string }): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('auth/login', credentials).pipe(
      tap((response) => {
        this.accessToken = response.token; // Asegúrate de que `token` esté en `ILoginResponse`
        this.user = response.authUser; // Asegúrate de que `authUser` esté en `ILoginResponse`
        this.save();
      })
    );
  }

  public loginWithGoogle(): void {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }

  public handleGoogleCallback(token: string, user: IUser): void {
    this.accessToken = token;
    this.user = user;
    this.save();
    this.router.navigate(['/home']);
  }

  private save(): void {
    if (this.user) localStorage.setItem('auth_user', JSON.stringify(this.user));
    if (this.accessToken) localStorage.setItem('access_token', JSON.stringify(this.accessToken));
  }

  public logout(): void {
    this.accessToken = null;
    this.user = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('auth_user');
    this.router.navigate(['/login']);
  }

  public isLoggedIn(): boolean {
    return !!this.accessToken;
  }

  public check(): boolean {
    return this.isLoggedIn();
  }

  public getUser(): IUser | undefined {
    return this.user || undefined; // Devuelve `undefined` si `this.user` es null
  }

  public hasRole(role: string): boolean {
    return this.user?.authorities?.some(authority => authority.authority === role) || false;
  }

  public isSuperAdmin(): boolean {
    return this.hasRole(IRoleType.superAdmin);
  }

  public hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  public getPermittedRoutes(routes: any[]): any[] {
    return routes.filter(route => {
      if (route.data && route.data.authorities) {
        return this.hasAnyRole(route.data.authorities);
      }
      return true;
    });
  }

  public signup(user: IUser): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('auth/signup', user);
  }

  public getUserAuthorities(): IAuthority[] {
    return this.user?.authorities || [];
  }

  public areActionsAvailable(routeAuthorities: string[]): boolean {
    const userAuthorities = this.getUserAuthorities();
    const allowedUser = routeAuthorities.some(authority =>
      userAuthorities.some(item => item.authority === authority)
    );
    const isAdmin = userAuthorities.some(item =>
      item.authority === IRoleType.admin || item.authority === IRoleType.superAdmin
    );
    return allowedUser && isAdmin;
  }
}