import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStateService } from '../services/user-state.service';

export const mfaGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userStateService = inject(UserStateService);

  const mfaVerified = userStateService.isMfaVerified();

  if (!mfaVerified) {
    router.navigate(['/forbidden'], {
      state: { message: 'Necesitas verificar tu identidad con MFA para acceder a esta página.' }
    });
    return false;
  }

  return true;
};
