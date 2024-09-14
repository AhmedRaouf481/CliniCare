import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, tap, BehaviorSubject } from "rxjs";
import { URLs } from "../../shared/api/api-urls";
import { JwtHelperService } from "@auth0/angular-jwt";
import {AuthResponse} from "../../interfaces/AuthResponse";
import {Role} from "../../interfaces/Role";
import {Router} from "@angular/router";



@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<AuthResponse | null>;
  public currentUser: Observable<AuthResponse | null>;
  private register_url = URLs.ApiBaseUrl + URLs.signUp;
  private login_url = URLs.ApiBaseUrl + URLs.login;
  private jwtHelper = new JwtHelperService();

  constructor(
    private _httpClient: HttpClient, private _router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  register(user: any): Observable<any> {
    return this._httpClient.post(`${this.register_url}`, user);
  }

  login(credentials: { email: string, password: string }): Observable<AuthResponse> {
    return this._httpClient.post<AuthResponse>(`${this.login_url}`, credentials).pipe(
      tap((response: AuthResponse) => {
        if (response && response.token) {
          this.setSession(response);
        }
      })
    );
  }

  private setSession(authResult: AuthResponse) {
    localStorage.setItem('auth', JSON.stringify(authResult));
    this.currentUserSubject.next(authResult);
  }

  logout() {
    localStorage.removeItem('auth');
    this.currentUserSubject.next(null);
    this._router.navigate(['/login'])
  }

  isLoggedIn(): boolean {
    const auth = this.getUserFromStorage();
    return auth != null && !this.jwtHelper.isTokenExpired(auth.token);
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    const auth = this.getUserFromStorage();
    return auth ? auth.token : null;
  }

  private getUserFromStorage(): AuthResponse | null {
    const authStr = localStorage.getItem('auth');
    if (authStr) {
      return JSON.parse(authStr) as AuthResponse;
    }
    return null;
  }

  getRoles(): Role[] {
    const currentUser = this.getCurrentUser();
    return currentUser ? currentUser.roles : [];
  }

  getUserId(): number | null {
    const currentUser = this.getCurrentUser();
    return currentUser ? currentUser.id : null;
  }

  public isDoctor(): boolean
  {
    return this.getRoles().some(role => role.name === 'DOCTOR');
  }

  public isPatient(): boolean
  {
    return this.getRoles().some(role => role.name === 'PATIENT');
  }


  getRedirectUrl(): string {
    const roles = this.getRoles();
    const userId = this.getUserId();

    if (!roles.length || !userId) return '/home';


    if (this.isDoctor() && this.isPatient()) {
      return '/';
    } else if (this.isDoctor()) {
      return `/doctor/${userId}`;
    } else if (this.isPatient()) {
      return `/patient/${userId}`;
    }

    return '/home';
  }
}
