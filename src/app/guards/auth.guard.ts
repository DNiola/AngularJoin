import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const afAuth = inject(AngularFireAuth);
  const router = inject(Router);

  return afAuth.authState.pipe(
    map(user => {
      if (user) {
        return true;  // User is logged in, allow access
      } else {
        router.navigate(['/login']);  // Not logged in, redirect to login page
        return false;  // Deny access
      }
    })
  );
};
