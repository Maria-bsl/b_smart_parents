import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError, timeout } from 'rxjs';
import { ApiConfigService } from 'src/app/services/api-config/api-config.service';
import {
  AppConfigService,
  SessionTokens,
} from 'src/app/services/app-config/app-config.service';
import { LoadingService } from 'src/app/services/loading-service/loading.service';

export const authsInterceptor: HttpInterceptorFn = (req, next) => {
  if (
    req.url.includes('/SchoolDetails/GetToken') ||
    req.url.startsWith('/assets/')
  ) {
    return next(req);
  }
  const hasSecondsPassed = (date1: Date, date2: Date, seconds: number) => {
    const differenceInMilliseconds = date2.getTime() - date1.getTime();
    const secondsInMilliseconds = seconds * 1000;
    return differenceInMilliseconds >= secondsInMilliseconds;
  };

  const isValidSession = ({
    token,
    expire_time,
    expire_timestamp,
  }: SessionTokens) => {
    const isNotNullOrEmpty = (value: string | null | undefined) =>
      value && value.length > 0;
    const isExistTokens =
      isNotNullOrEmpty(token) &&
      isNotNullOrEmpty(expire_time) &&
      isNotNullOrEmpty(expire_timestamp);
    if (!isExistTokens) return isExistTokens;
    const expireIn = new Date(expire_timestamp!);
    return !hasSecondsPassed(expireIn, new Date(), parseInt(expire_time!));
  };

  const setGwxAuthorization = (
    request: HttpRequest<unknown>,
    token: string
  ) => {
    return request.clone({
      headers: request.headers.set('GWX-Authorization', `Bearer ${token}`),
    });
  };

  let apiService = inject(ApiConfigService);
  let appConfig = inject(AppConfigService);
  let sessionTokens = appConfig.getSessionTokens();
  let router = inject(Router);

  if (isValidSession(sessionTokens)) {
    let authReq = setGwxAuthorization(req, sessionTokens?.token!);
    return next(authReq);
  } else {
    return apiService.getToken().pipe(
      switchMap((res) => {
        appConfig.setSessionTokens(res);
        let authReq = setGwxAuthorization(req, sessionTokens?.token!);
        return next(authReq);
      }),
      catchError((err: any) => {
        console.error('Error in getToken:', err); // Log error for debugging
        throw err; // Rethrow error if needed
      })
    );
  }
};

export const timeoutInterceptor: HttpInterceptorFn = (req, next) => {
  let timeoutDuration = 30000;
  let appConfig = inject(AppConfigService);
  let loadingService = inject(LoadingService);
  return next(req).pipe(
    timeout(timeoutDuration),
    catchError((err) => {
      appConfig.openAlertMessageBox(
        'defaults.failed',
        'defaults.errors.requestTookTooLong'
      );
      loadingService.dismiss();
      return throwError(() => err);
    })
  );
};
