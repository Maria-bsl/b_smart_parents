import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const homeGuard: CanActivateFn = (route, state) => {
  let students = localStorage.getItem('GetSDetails');
  return students ? true : inject(Router).createUrlTree(['/login']);
};
