import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, switchMap, filter, take, retry } from 'rxjs';
import { AuthService } from '@services/auth.service';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error) => {
      let msg = '';
      if (error.status === 401) {
        return authService.refreshToken().pipe(
          retry({
            count: 2,
            delay: 500
          }),
          switchMap((response) => {
            return next(req);
          }),
          catchError((refreshError) => {
            msg = 'Sesión expirada. Redirigiendo al login...';
            console.error('Error interceptado:', msg, refreshError);
            alert(msg);
            router.navigate(['/login']);
            return throwError(() => new Error(msg));
          })
        );
      } else if (error.status === 500) {
        msg = 'Error interno del servidor.';
      } else if (error.status === 404) {
        msg = 'Recurso no encontrado.';
      } else {
        msg = 'Error inesperado: ' + error.message;
      }

      console.error('Error interceptado:', msg);
      alert(msg);
      return throwError(() => new Error(msg));
    })
  );
};

