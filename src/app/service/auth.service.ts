import { inject, Injectable, PLATFORM_ID, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterDTO } from '../dto/RegisterDTO';
import { Observable, tap, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LoginDTO } from '../dto/LoginDTO';
import { LoginResponseDTO } from '../dto/LoginResponseDTO';
import { UserInfoDTO } from '../dto/UserInfoDTO';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private url = "http://localhost:8080";
  private router = inject(Router)
  private platformId = inject(PLATFORM_ID);

  private _isLoggedIn = signal<boolean>(false);
  isLoggedIn: Signal<boolean> = this._isLoggedIn.asReadonly();

  private _userInfo = signal<UserInfoDTO | null>(null);
  userInfo: Signal<UserInfoDTO | null> = this._userInfo.asReadonly();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this._isLoggedIn.set(!!localStorage.getItem("activeToken"));
    }
  }

  initUserData() {
    if (isPlatformBrowser(this.platformId) && this._isLoggedIn()) {
      this.getUser().subscribe({
        next: (data) => {
          this._userInfo.set(data);
        }
      })
    }
  }

  register(registerDTO: RegisterDTO): Observable<void> {
    return this.http.post<any>(`${this.url}/auth/register`, registerDTO);
  }

  login(loginDTO: LoginDTO): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(`${this.url}/auth/login`, loginDTO, {
      withCredentials: true
    }).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem("activeToken", response.activeToken);
          this._isLoggedIn.set(true);
          this.initUserData();
          this.router.navigate(["/"]);
        }
      })
    );
  }

  logout(): void {
    this.http.post(`${this.url}/auth/logout`, {})
      .pipe(
        catchError(err => {
          console.error("Errore durante il logout lato server:", err);
          return throwError(() => err);
        }),
        finalize(() => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem("activeToken");
            this._isLoggedIn.set(false);
            this._userInfo.set(null);

          }
          this.router.navigate(['/']);
        })
      )
      .subscribe();
  }

  refresh(): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(`${this.url}/auth/refresh`, {}, { withCredentials: true }).pipe(
      tap(response => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("activeToken");
          localStorage.setItem("activeToken", response.activeToken);
        }
      })
    );
  }

  getUser(): Observable<UserInfoDTO> {
    return this.http.get<UserInfoDTO>(`${this.url}/user/me`);
  }

  isUserLogin(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem("activeToken");
    }
    return false;
  }
}
