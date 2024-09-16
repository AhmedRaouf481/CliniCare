import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, tap, BehaviorSubject, catchError, finalize, switchMap, of} from "rxjs";
import {URLs} from "../../shared/api/api-urls";
import {JwtHelperService} from "@auth0/angular-jwt";
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
  private logout_url = URLs.ApiBaseUrl+URLs.logout

  constructor(
    private _httpClient: HttpClient, private _router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  register(user: any): Observable<AuthResponse> {
    return this._httpClient.post<AuthResponse>(`${this.register_url}`, user).pipe(
      tap((response: AuthResponse) => {
        if (response && response.token) {
          this.setSession(response);
        }
      })
    );
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

  logout(): Observable<boolean> {
    return this._httpClient.post(`${this.logout_url}`, {}).pipe(
      switchMap(() => of(true)),
      catchError(error => {
        console.error('Logout error', error);
        return of(false);
      }),
      finalize(() => {
        this.clearSession();
      })
    );
  }

  private clearSession() {
    localStorage.removeItem('auth');
    this.currentUserSubject.next(null);
    this._router.navigate(['/login']);
  }



  private setSession(authResult: AuthResponse) {
    localStorage.setItem('auth', JSON.stringify(authResult));
    this.currentUserSubject.next(authResult);
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



  public isDoctor(): boolean {
    return this.getRoles().some(role => role.name === 'DOCTOR');
  }

  public isPatient(): boolean {
    return this.getRoles().some(role => role.name === 'PATIENT');
  }


  getRedirectUrl(): string {

    if (this.isDoctor() && this.isPatient()) {
      return '/doctor/profile';
    } else if (this.isDoctor()) {
      return `/doctor/profile`;
    } else if (this.isPatient()) {
      return `/patient/profile`;
    }

    return '/home';
  }
}
