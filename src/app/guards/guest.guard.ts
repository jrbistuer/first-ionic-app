import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Allows access only when signed out; redirects signed-in users to the app. */
export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = await auth.authReady();
  return user ? router.parseUrl('/tabs/tab1') : true;
};
