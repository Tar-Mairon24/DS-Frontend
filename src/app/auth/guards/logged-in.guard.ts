import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStateService } from '@services/user-state.service';
import { AuthService } from '@services/auth.service';
import { catchError, of } from 'rxjs';
import { map } from 'rxjs/operators';

export const loggedInGuard: CanActivateFn = (route, state) => {
  const userStateService = inject(UserStateService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const userRole = userStateService.getUserRole();

  if (!userRole) {
    router.navigate(['/login']);
    return false;
  }

  // Verify that the JWT is still valid by checking auth status
  // This helps handle cases where JWT expired but localStorage still has user data
  return authService.verifyAuth().pipe(
    map((response) => {
      // Auth is still valid, allow navigation
      return true;
    }),
    catchError((error) => {
      console.error('Auth verification failed:', error);
      // JWT likely expired, try to refresh
      if (error.status === 401) {
        return authService.refreshToken().pipe(
          map(() => {
            console.log('Token refreshed successfully in guard');
            return true;
          }),
          catchError(() => {
            console.error('Token refresh failed in guard');
            userStateService.clearUserData();
            router.navigate(['/login']);
            return of(false);
          })
        );
      }
      // Other errors - redirect to login
      userStateService.clearUserData();
      router.navigate(['/login']);
      return of(false);
    })
  );
};
