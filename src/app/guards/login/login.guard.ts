import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
  let students = localStorage.getItem('GetSDetails');
  return students ? false : inject(Router).createUrlTree(['/home']);
};
