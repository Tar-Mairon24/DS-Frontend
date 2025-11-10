import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      let msg = '';

      if (error.status === 401) {
        msg = 'No autorizado. Redirigiendo al login...';
        router.navigate(['/login']);
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

