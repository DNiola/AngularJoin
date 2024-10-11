import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

/**
 * Auth guard to protect routes from unauthorized access.
 *
 * This guard checks if the user is authenticated before allowing access to the route.
 * If the user is not authenticated, they are redirected to the login page.
 *
 * @param {ActivatedRouteSnapshot} route - The route to be activated.
 * @param {RouterStateSnapshot} state - The state of the router at the time of activation.
 * @returns {Observable<boolean>} Observable that emits true if the user is authenticated, otherwise false.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const afAuth = inject(AngularFireAuth);
  const router = inject(Router);

  return afAuth.authState.pipe(
    map(user => {
      if (user) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
