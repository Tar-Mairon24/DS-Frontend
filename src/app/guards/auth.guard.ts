import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStateService } from '../services/user-state.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userStateService = inject(UserStateService);
  const router = inject(Router);

  const userRole = userStateService.getUserRole();

  if (!userRole) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRole = route.data['role'];

  if (requiredRole && userRole !== requiredRole) {
    router.navigate(['/forbidden'], {
      state: { message: 'No tienes permiso para acceder a esta página.' }
    });
    return false;
  }

  return true;
};
