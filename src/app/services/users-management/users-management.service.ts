import { Injectable } from '@angular/core';
import { ApiConfigService } from '../api-config/api-config.service';
import { AppConfigService } from '../app-config/app-config.service';
import { UnsubscriberService } from '../unsubscriber/unsubscriber.service';
import { FLoginForm } from 'src/app/core/forms/f-login-form';
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
  throwError,
  zip,
} from 'rxjs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GetFacilities } from 'src/app/core/interfaces/GetFacilities';
import { GetParentDetail } from 'src/app/core/interfaces/GetParentDetails';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { LoadingService } from '../loading-service/loading.service';
import {
  GetSDetails,
  GetSDetailsErrorStatus,
} from 'src/app/core/interfaces/GetSDetails';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class UsersManagementService {
  // studentDetails = signal<GetSDetails>(
  //   JSON.parse(localStorage.getItem('GetSDetails')!)
  // );
  studentDetails$ = new Subject<GetSDetails>();
  constructor(
    private apiService: ApiConfigService,
    private appConfigService: AppConfigService,
    private _unsubscribe: UnsubscriberService,
    private router: Router,
    private tr: TranslateService,
    private loadingService: LoadingService,
    private navCtrl: NavController
  ) {}
  private displayFailedToLoginError() {
    let failedMessageObs = 'defaults.failed';
    let errorOccuredMessageObs =
      'loginPage.loginForm.messageBox.errors.errorOccuredText';
    this.appConfigService.openAlertMessageBox(
      failedMessageObs,
      errorOccuredMessageObs
    );
  }
  private displayFailedToGetParentDetailsError() {
    let failedMessageObs = 'defaults.failed';
    let errorMessageObs = 'changePasswordPage.errors.failedToGetParentDetails';
    this.appConfigService.openAlertMessageBox(
      failedMessageObs,
      errorMessageObs
    );
  }
  private displayFailedChangePasswordError() {
    let failedMessageObs = 'defaults.failed';
    let msgObs =
      'changePasswordPage.changePasswordForm.errors.failedToUpdatePasswordText';
    this.appConfigService.openAlertMessageBox(failedMessageObs, msgObs);
  }
  private requestChangePassword(email: string, password: string) {
    let form = new Map();
    form.set('Email_Address', email);
    form.set('New_Password', password);
    this.apiService
      .changePassword(Object.fromEntries(form))
      .pipe(
        this._unsubscribe.takeUntilDestroy,
        finalize(() => this.loadingService.dismiss())
      )
      .subscribe({
        next: (res: any) => {
          if (Object.prototype.hasOwnProperty.call(res[0], 'Status')) {
            toast.success(res[0].Status);
            this.router.navigate(['/tabs/tab-1']);
          } else {
            this.displayFailedChangePasswordError();
          }
        },
        error: (err) => {
          this.displayFailedChangePasswordError();
        },
      });
  }
  matchValidator(matchTo: string, reverse?: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.parent && reverse) {
        const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
        if (c) {
          c.updateValueAndValidity();
        }
        return null;
      }
      return !!control.parent &&
        !!control.parent.value &&
        control.value === (control.parent?.controls as any)[matchTo].value
        ? null
        : { matching: true };
    };
  }
  getParentDetails(
    username: string,
    parentDetail$: Subject<GetParentDetail | null>
  ) {
    this.loadingService.startLoading().then((loading) => {
      this.apiService
        .getParentDetails({ User_Name: username })
        .pipe(
          this._unsubscribe.takeUntilDestroy,
          finalize(() => this.loadingService.dismiss())
        )
        .subscribe({
          next: (res: any) => {
            if (Object.prototype.hasOwnProperty.call(res[0], 'Status')) {
              switch (res[0].Status) {
                case 'Parent Details':
                  parentDetail$.next(res[0]);
                  break;
                case 'UserName not exists':
                default:
                  parentDetail$.next(null);
                  break;
              }
            } else {
              this.displayFailedToGetParentDetailsError();
            }
          },
          error: (err) => {
            parentDetail$.next(null);
            this.displayFailedToGetParentDetailsError();
          },
        });
    });
  }
  changePassword(password: string) {
    this.loadingService.startLoading().then((loading) => {
      let getParentDetailsObs = this.apiService.getParentDetails({
        User_Name: localStorage.getItem('User_Name')!,
      });
      let merged = zip(getParentDetailsObs);
      merged.pipe(this._unsubscribe.takeUntilDestroy).subscribe({
        next: (res: any) => {
          let [details] = res;
          if (Object.prototype.hasOwnProperty.call(details[0], 'Status')) {
            switch (details[0].Status) {
              case 'Parent Details':
                let parentDetail = details[0] as GetParentDetail;
                this.requestChangePassword(
                  parentDetail.Email_Address,
                  password
                );
                break;
              case 'UserName not exists':
              default:
                this.loadingService.dismiss();
                this.displayFailedChangePasswordError();
                break;
            }
          } else {
            this.loadingService.dismiss();
            this.displayFailedChangePasswordError();
          }
        },
        error: (err) => {
          this.displayFailedToGetParentDetailsError();
        },
      });
    });
  }
  private signInUser(body: FLoginForm) {
    return this.apiService.signIn(body).pipe(
      this._unsubscribe.takeUntilDestroy,
      tap({
        next: (value) => {
          const hasErrorStatus = Object.keys(value[0]).includes('status');
          if (hasErrorStatus) throw Error('Username or password is incorrect.');
        },
      }),
      finalize(() => this.loadingService.dismiss()),
      catchError((err) => {
        throw err;
      })
    );
  }
  loginUser(body: FLoginForm) {
    this.loadingService.startLoading().then((loading) => {
      this.apiService
        .signIn(body)
        .pipe(
          this._unsubscribe.takeUntilDestroy,
          finalize(() => this.loadingService.dismiss())
        )
        .subscribe({
          next: (res: any) => {
            if (Object.prototype.hasOwnProperty.call(res[0], 'status')) {
              let failedMessageObs = 'defaults.failed';
              let incorrectUsernamePasswordMessageObs =
                'loginPage.loginForm.messageBox.errors.usernamePasswordIncorrect';
              this.appConfigService.openAlertMessageBox(
                failedMessageObs,
                incorrectUsernamePasswordMessageObs
              );
            } else {
              let GetSDetails = JSON.stringify(res[0]);
              localStorage.setItem('GetSDetails', GetSDetails);
              localStorage.setItem('User_Name', body.User_Name);
              localStorage.setItem('Password', body.Password);
              this.navCtrl.navigateForward(['/home']);
              //this.router.navigate(['/home']);
            }
          },
          error: (err) => {
            this.displayFailedToLoginError();
          },
        });
    });
  }
  initToken() {
    this.loadingService
      .startLoading()
      .then((loading) => {
        this.apiService
          .getToken()
          .pipe(
            this._unsubscribe.takeUntilDestroy,
            tap({
              next: (res) => {
                localStorage.setItem('token', res.token);
                localStorage.setItem('expire_time', res.expire_time);
                localStorage.setItem(
                  'expire_timestamp',
                  new Date().toISOString()
                );
              },
            }),
            finalize(() => this.loadingService.dismiss())
          )
          .subscribe();
      })
      .catch((err) => {
        throw err;
      });
  }
  requestToken(body: FLoginForm) {
    this.loadingService.startLoading().then((loading) => {
      this.apiService
        .requestToken(body)
        .pipe(
          this._unsubscribe.takeUntilDestroy,
          tap({
            next: (res) => {
              localStorage.setItem('token', res.token);
              localStorage.setItem('expire_time', res.expire_time);
              localStorage.setItem(
                'expire_timestamp',
                new Date().toISOString()
              );
            },
          }),
          switchMap((res: any) =>
            this.apiService
              .signIn(body)
              .pipe(finalize(() => this.loadingService.dismiss()))
          )
        )
        .subscribe({
          next: (res) => {
            if (Object.prototype.hasOwnProperty.call(res[0], 'status')) {
              let failedMessageObs = 'defaults.failed';
              let incorrectUsernamePasswordMessageObs =
                'loginPage.loginForm.messageBox.errors.usernamePasswordIncorrect';
              this.appConfigService.openAlertMessageBox(
                failedMessageObs,
                incorrectUsernamePasswordMessageObs
              );
            } else {
              let GetSDetails = JSON.stringify(res[0]);
              localStorage.setItem('GetSDetails', GetSDetails);
              localStorage.setItem('User_Name', body.User_Name);
              localStorage.setItem('Password', body.Password);
              this.router.navigate(['/home']);
            }
          },
          error: (err) => {
            this.loadingService.dismiss();
            this.displayFailedToLoginError();
          },
        });
    });
  }
  logOutUser() {
    this.loadingService.dismiss();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
