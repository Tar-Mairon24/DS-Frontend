import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, throwError, switchMap, filter, take, finalize, timeout, retry } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { ErrorModalService } from '@services/error-modal.service';
import { UserStateService } from '@services/user-state.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<boolean>(false);

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const modal = inject(ErrorModalService);
  const userState = inject(UserStateService);

  // Skip interceptor for auth endpoints to avoid circular 401s
  if (req.url.includes('/auth/refresh-token') || req.url.includes('/auth/login')) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error) => {
      let msg = '';

      if (error.status === 401) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(false);

          console.log('Token expired, attempting to refresh...');

          return authService.refreshToken().pipe(
            retry({
              count: 2,
              delay: 500
            }),
            switchMap((response: any) => {
              console.log('Token refreshed successfully');
              refreshTokenSubject.next(true);
              return next(req);
            }),
            catchError((refreshError) => {
              console.error('Token refresh failed:', refreshError);
              msg = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
              userState.clearUserData();
              router.navigate(['/login']);
              return throwError(() => new Error(msg));
            }),
            finalize(() => {
              isRefreshing = false;
            })
          );
        } else {
          console.log('Waiting for token refresh to complete...');
          return refreshTokenSubject.pipe(
            filter(refreshed => refreshed === true),
            take(1),
            timeout(10000), // 10 second timeout to prevent infinite waiting
            switchMap(() => {
              console.log('Retrying request after token refresh');
              return next(req);
            }),
            catchError((retryError) => {
              console.error('Request retry failed after token refresh:', retryError);
              msg = 'Sesión expirada. Redirigiendo al login...';
              userState.clearUserData();
              router.navigate(['/login']);
              return throwError(() => new Error(msg));
            })
          );
        }
      } else if (error.status === 500) {
        msg = 'Error interno del servidor. Intenta más tarde.';
      } else if (error.status === 413) {
        msg = 'Archivo muy grande. El límite máximo es 100MB.';
      } else if (error.status === 404) {
        msg = 'El recurso solicitado no existe.';
      } else if (error.status === 403) {
        msg = 'No tienes permisos para realizar esta acción.';
      } else if (error.status >= 400 && error.status < 500) {
        msg = error.error?.message || 'Error en la solicitud. Verifica los datos enviados.';
      } else {
        msg = error.message || 'Error inesperado. Intenta de nuevo.';
      }

      console.error('Error interceptado:', msg, error);
      if (error.status !== 401) {
        modal.showError(msg);
      }
      return throwError(() => new Error(msg));
    })
  );
};

