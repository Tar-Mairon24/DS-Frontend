import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStateService } from '@services/user-state.service';

export const loggedInGuard: CanActivateFn = (route, state) => {
  const userStateService = inject(UserStateService);
  const router = inject(Router);

  const userRole = userStateService.getUserRole();

  if (!userRole) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
