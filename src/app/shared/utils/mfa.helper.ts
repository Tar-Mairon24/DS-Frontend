import { UserStateService } from '@services/user-state.service';
import { Router } from '@angular/router';

export function navigateWithMfa(
  route: string,
  reason: string,
  userStateService: UserStateService,
  context: { propsEmail: string; pendingRoute: string; propsReason: string; showMfa: boolean }
) {
  if (userStateService.isMfaEnabled()) {
    return false;
  }

  context.propsEmail = userStateService.getUserEmail();
  context.pendingRoute = route;
  context.propsReason = reason;
  context.showMfa = true;
  return true;
}
