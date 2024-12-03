import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, finalize, Observable, of, zip } from 'rxjs';
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

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  overallAttendance$ = new BehaviorSubject<OverallAttendance[]>([]);
  pendingStudentInvoices$ = new BehaviorSubject<StudentPendingInvoice[]>([]);
  // selectedStudent: GetSDetailStudents = JSON.parse(
  //   localStorage.getItem('selectedStudent')!
  // );
  selectedStudent!: GetSDetailStudents;
  constructor(
    private tr: TranslateService,
    private appConfig: AppConfigService,
    private apiService: ApiConfigService,
    private _unsubscriber: UnsubscriberService,
    private usersService: UsersManagementService,
    private loadingService: LoadingService
  ) {
    //this.initDashboard();
  }
  initDashboard() {
    this.selectedStudent = JSON.parse(localStorage.getItem('selectedStudent')!);
    let body: StudentDetailsForm = {
      Facility_Reg_Sno: this.selectedStudent.Facility_Reg_Sno.toString(),
      Admission_No: this.selectedStudent.Admission_No,
      From_Date: undefined,
      To_Date: undefined,
    };
    this.loadingService.startLoading().then((loading) => {
      let attendanceObs = this.apiService.getAttendance(body);
      let invoicesObs = this.apiService.getStudentPendingInvoices(body);
      let merged = zip(attendanceObs, invoicesObs);
      merged
        .pipe(
          this._unsubscriber.takeUntilDestroy,
          finalize(() => this.loadingService.dismiss())
        )
        .subscribe({
          next: (results) => {
            let [attendance, invoices] = results;
            this.overallAttendance$.next(attendance);
            this.pendingStudentInvoices$.next(invoices);
          },
          error: (err) => {
            console.log('error happened here');
          },
        });
    });
  }
  logUserOut() {
    let msg1Obs = this.tr.get('defaults.confirm');
    let msg2Obs = this.tr.get('defaults.dialogs.sureLogoutText');
    let merged = zip(msg1Obs, msg2Obs);
    merged.pipe(this._unsubscriber.takeUntilDestroy).subscribe({
      next: (results) => {
        let [msg1, msg2] = results;
        let dialogRef = this.appConfig.openConfirmMessageBox(msg1, msg2);
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
