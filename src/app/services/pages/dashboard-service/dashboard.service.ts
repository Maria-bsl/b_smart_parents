import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  delay,
  finalize,
  firstValueFrom,
  from,
  merge,
  mergeAll,
  Observable,
  of,
  switchMap,
  tap,
  zip,
} from 'rxjs';
import { UnsubscriberService } from '../../unsubscriber/unsubscriber.service';
import { UsersManagementService } from '../../users-management/users-management.service';
import { AppConfigService } from '../../app-config/app-config.service';
import { ApiConfigService } from '../../api-config/api-config.service';
import { FTimeTableForm as StudentDetailsForm } from 'src/app/core/forms/f-time-table-form';
import { GetSDetailStudents } from 'src/app/core/interfaces/GetSDetails';
import { OverallAttendance } from 'src/app/core/types/attendance';
import {
  StudentInvoice,
  StudentPendingInvoice,
} from 'src/app/core/types/student-invoices';
import { LoadingService } from '../../loading-service/loading.service';
import { AttendancePageService } from '../attendance-page-service/attendance-page-service.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  overallAttendance$ = new BehaviorSubject<OverallAttendance[]>([]);
  pendingStudentInvoices$ = new BehaviorSubject<StudentPendingInvoice[]>([]);
  selectedStudent!: GetSDetailStudents;
  constructor(
    private tr: TranslateService,
    private appConfig: AppConfigService,
    private apiService: ApiConfigService,
    private _unsubscriber: UnsubscriberService,
    private usersService: UsersManagementService,
    private loadingService: LoadingService,
    private attendanceService: AttendancePageService
  ) {
    //this.initDashboard();
  }
  initDashboard() {
    this.selectedStudent = JSON.parse(localStorage.getItem('selectedStudent')!);
    let body: StudentDetailsForm = {
      Facility_Reg_Sno: this.selectedStudent.Facility_Reg_Sno.toString(),
      Admission_No: this.selectedStudent.Admission_No,
    };
    this.loadingService.startLoading().then((loading) => {
      let attendanceObs = this.apiService.getAttendance(body);
      let invoicesObs = this.apiService.getStudentPendingInvoices(body);
      attendanceObs
        .pipe(
          this._unsubscriber.takeUntilDestroy,
          tap((value) => this.overallAttendance$.next(value)),
          switchMap((value) => invoicesObs),
          tap((value) => this.pendingStudentInvoices$.next(value)),
          finalize(() => this.loadingService.dismiss())
        )
        .subscribe({
          next: (res) => {},
          error: (err) => {},
        });
    });
  }
  logUserOut() {
    const dialogRef$ = this.appConfig.openConfirmMessageBox(
      'defaults.confirm',
      'defaults.dialogs.sureLogoutText'
    );
    dialogRef$.subscribe({
      next: (dialogRef) => {
        dialogRef.componentInstance.confirmed
          .asObservable()
          .pipe(this._unsubscriber.takeUntilDestroy)
          .subscribe({
            next: () => {
              this.usersService.logOutUser();
            },
          });
      },
    });
  }
}
