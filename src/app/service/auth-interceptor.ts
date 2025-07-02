import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let token: string | null = null;
  const allowedUrls = ['/auth/register', '/auth/login', "/auth/refresh"];
  const auth = inject(AuthService);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem("activeToken");
  }

  if (allowedUrls.some(url => req.url.includes(url))) {
    return next(req);
  }

  const newReq = req.clone({
    headers: req.headers.set("Authorization", `Bearer ${token}`),
  });

  return next(newReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return auth.refresh().pipe(
          switchMap((response) => {
            const updatedToken = response.activeToken;
            const retrieReq = req.clone({
              headers: req.headers.set("Authorization", `Bearer ${updatedToken}`),
            });
            return next(retrieReq);
          }),
          catchError((refreshError: HttpErrorResponse) => {
            if (refreshError.status === 401) {
              auth.logout();
              return throwError(() => refreshError);
            }
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};