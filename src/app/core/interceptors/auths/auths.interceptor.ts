import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
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
