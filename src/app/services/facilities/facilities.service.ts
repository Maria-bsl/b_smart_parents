import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  of,
  Subject,
  tap,
  zip,
} from 'rxjs';
import { ApiConfigService } from '../api-config/api-config.service';
import { GetFacilities } from 'src/app/core/interfaces/GetFacilities';
import { AppConfigService } from '../app-config/app-config.service';
import { UnsubscriberService } from '../unsubscriber/unsubscriber.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FRegisterParent } from 'src/app/core/forms/f-add-student';
import { UsersManagementService } from '../users-management/users-management.service';

@Injectable({
  providedIn: 'root',
})
export class FacilitiesService {
  faculties$ = new BehaviorSubject<GetFacilities[]>([]);
  constructor(
    private usersService: UsersManagementService,
    private apiService: ApiConfigService,
    private appConfigService: AppConfigService,
    private _unsubscriber: UnsubscriberService,
    private router: Router,
    private tr: TranslateService
  ) {}
  private displayFailedToFetchFaculties() {
    let failedMessageObs = 'defaults.failed';
    let errorOccuredMessageObs = 'addStudentPage.errors.failedToFindFaculties';
    this.appConfigService.openAlertMessageBox(
      failedMessageObs,
      errorOccuredMessageObs
    );
  }
  private displayFailedToAddStudentError() {
    let failedMessageObs = 'defaults.failed';
    let errorOccuredMessageObs = 'addStudentPage.errors.failedToAddStudent';
    this.appConfigService.openAlertMessageBox(
      failedMessageObs,
      errorOccuredMessageObs
    );
  }
  private facultiesList() {
    this.appConfigService.startLoading().then((loading) => {
      this.apiService
        .getFacilities({})
        .pipe(
          this._unsubscriber.takeUntilDestroy,
          finalize(() => loading.dismiss())
        )
        .subscribe({
          next: (res: any) => {
            this.faculties$.next(res);
          },
          error: (err) => {
            this.displayFailedToFetchFaculties();
          },
        });
    });
  }
  getFacultiesList() {
    // this.appConfigService.startLoading().then((loading) => {
    //   this.apiService
    //     .requestToken({} as any)
    //     .pipe(
    //       this._unsubscriber.takeUntilDestroy,
    //       finalize(() => loading.dismiss())
    //     )
    //     .subscribe({
    //       next: (res: any) => {
    //         localStorage.setItem('token', res.token);
    //         localStorage.setItem('expire_time', res.expire_time);
    //         this.facultiesList();
    //       },
    //       error: (err) => {
    //         this.displayFailedToFetchFaculties();
    //       },
    //     });
    // });
    this.facultiesList();
  }
  addStudent(addStudentForm: FRegisterParent) {
    this.appConfigService.startLoading().then((loading) => {
      this.apiService
        .addStudent(addStudentForm)
        .pipe(
          this._unsubscriber.takeUntilDestroy,
          finalize(() => loading.dismiss())
        )
        .subscribe({
          next: (res: any) => {
            if (Object.prototype.hasOwnProperty.call(res[0], 'Status')) {
              let failedMessageObs = 'defaults.failed';
              let errorMessage = res[0].Status;
              this.appConfigService.openAlertMessageBox(
                failedMessageObs,
                errorMessage
              );
            } else {
            }
          },
          error: (err) => {
            this.displayFailedToAddStudentError();
          },
        });
    });
  }
}
