import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStateService } from '../services/user-state.service';

export const mfaGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userStateService = inject(UserStateService);

  const mfaVerified = userStateService.isMfaVerified();

  if (!mfaVerified) {
    router.navigate(['/forbidden'], {
      state: {
        message: 'Tu sesión MFA ha expirado. Por favor verifica tu identidad nuevamente.'
      }
    });
    return false;
  }

  return true;
};
