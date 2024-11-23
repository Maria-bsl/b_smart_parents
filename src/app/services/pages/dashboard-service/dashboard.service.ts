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

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  overallAttendance$!: Observable<OverallAttendance>; //= new BehaviorSubject<OverallAttendance | null>(null);
  pendingStudentInvoices$!: Observable<StudentPendingInvoice[]>;
  selectedStudent: GetSDetailStudents = JSON.parse(
    localStorage.getItem('selectedStudent')!
  );
  constructor(
    private tr: TranslateService,
    private appConfig: AppConfigService,
    private apiService: ApiConfigService,
    private _unsubscriber: UnsubscriberService,
    private usersService: UsersManagementService
  ) {}
  initDashboard() {
    let body: StudentDetailsForm = {
      Facility_Reg_Sno: this.selectedStudent.Facility_Reg_Sno,
      Admission_No: this.selectedStudent.Admission_No,
      From_Date: undefined,
      To_Date: undefined,
    };
    this.appConfig.startLoading().then((loading) => {
      let attendanceObs = this.apiService.getAttendance(body);
      let invoicesObs = this.apiService.getStudentPendingInvoices(body);
      let merged = zip(attendanceObs, invoicesObs);
      merged
        .pipe(
          this._unsubscriber.takeUntilDestroy,
          finalize(() => loading.dismiss())
        )
        .subscribe({
          next: (results) => {
            let [attendance, invoices] = results;
            this.overallAttendance$ = of(attendance[0]);
            this.pendingStudentInvoices$ = of(invoices);
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
