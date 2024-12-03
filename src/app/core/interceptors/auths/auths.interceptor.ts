import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, timeout } from 'rxjs';
import { AppConfigService } from 'src/app/services/app-config/app-config.service';

export const authsInterceptor: HttpInterceptorFn = (req, next) => {
  const appConfig = inject(AppConfigService);
  if (
    req.url.includes('/SchoolDetails/GetToken') ||
    req.url.includes('/assets/i18n/')
  ) {
    return next(req);
  }
  const token = appConfig.getToken();
  if (token && token.length > 0) {
    const authReq = req.clone({
      headers: req.headers.set('GWX-Authorization', `Bearer ${token}`),
    });
    return next(authReq);
  }
  return next(req);
};

export const timeoutInterceptor: HttpInterceptorFn = (req, next) => {
  let timeoutDuration = 500;
  let appConfig = inject(AppConfigService);
  return next(req).pipe(
    timeout(timeoutDuration),
    catchError((err) => {
      return throwError(() => err);
    })
  );
  // return next(req).pipe(
  //   timeout(timeoutDuration),
  //   catchError((err) => {
  //     if (err instanceof HttpErrorResponse) {
  //       if (err.status === 401 && appConfig.getLoginResponse()) {
  //         login
  //           .logout({ userid: appConfig.getUserIdFromSessionStorage() })
  //           .then((result) => {
  //             handleUnauthorizedUser(appConfig, router, tr);
  //           })
  //           .catch((err) => {
  //             throw err;
  //           });
  //       } else {
  //         return throwError(() => err);
  //       }
  //     }
  //     return throwError(() => err);
  //   })
  // );
};
