import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, switchMap, retry } from 'rxjs';
import { AuthService } from '@services/auth.service';

let isRefreshing = false;

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error) => {
      let msg = '';

      if (error.status === 401 && !isRefreshing) {
        isRefreshing = true;

        return authService.refreshToken().pipe(
          retry({
            count: 2,
            delay: 1000
          }),
          switchMap((response) => {
            isRefreshing = false;
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
      } else if (error.status === 401 && isRefreshing) {
        router.navigate(['/login']);
        return throwError(() => new Error('Sesión expirada'));
      } else if (error.status === 500) {
        msg = 'Error interno del servidor. Intenta de nuevo más tarde.';
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
      // Only show alert for non-401 errors (since 401 is handled separately)
      if (error.status !== 401) {
        alert(msg);
      }
      return throwError(() => new Error(msg));
    })
  );
};

