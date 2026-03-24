import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, throwError, switchMap, filter, take } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { ErrorModalService } from '@services/error-modal.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const modal = inject(ErrorModalService);

  return next(req).pipe(
    catchError((error) => {
      let msg = '';

      if (error.status === 401) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.refreshToken().pipe(
            switchMap((response: any) => {
              isRefreshing = false;
              // Emit new token so other pending requests can proceed
              refreshTokenSubject.next(response.data?.token || response.token || '');
              // Retry the original request
              return next(req);
            }),
            catchError((refreshError) => {
              isRefreshing = false;
              msg = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
              console.error('Token refresh failed:', refreshError);
              router.navigate(['/login']);
              return throwError(() => new Error(msg));
            })
          );
        } else {
          // If already refreshing, wait for refresh to complete then retry
          return refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap(() => next(req)),
            catchError(() => {
              msg = 'Sesión expirada. Redirigiendo al login...';
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

