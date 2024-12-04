import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../api-config/api-config.service';
import { FTimeTableForm as StudentDetailsForm } from 'src/app/core/forms/f-time-table-form';
import { GetSDetailStudents } from 'src/app/core/interfaces/GetSDetails';
import { AppConfigService } from '../../app-config/app-config.service';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  finalize,
  merge,
  switchMap,
  tap,
  zip,
} from 'rxjs';
import { UnsubscriberService } from '../../unsubscriber/unsubscriber.service';
import {
  StudentInvoice,
  StudentPaidInvoice,
  StudentPendingInvoice,
} from 'src/app/core/types/student-invoices';
import { LoadingService } from '../../loading-service/loading.service';

@Injectable({
  providedIn: 'root',
})
export class FeesPageService {
  studentInvoices$ = new BehaviorSubject<StudentInvoice[]>([]);
  studentPendingInvoices$ = new BehaviorSubject<StudentPendingInvoice[]>([]);
  studentPaidInvoice$ = new BehaviorSubject<StudentPaidInvoice[]>([]);
  constructor(
    private apiService: ApiConfigService,
    private unsubscribe: UnsubscriberService,
    private loadingService: LoadingService
  ) {}
  private requestStudentFees(body: StudentDetailsForm) {
    this.loadingService.startLoading().then((loading) => {
      let invoicesObs = this.apiService.getStudentInvoices(body);
      let pendingObs = this.apiService.getStudentPendingInvoices(body);
      let paidObs = this.apiService.getStudentPaidInvoices(body);
      invoicesObs
        .pipe(
          this.unsubscribe.takeUntilDestroy,
          tap((invoices) => this.studentInvoices$.next(invoices)),
          switchMap((invoices) => pendingObs),
          tap((pending) => this.studentPendingInvoices$.next(pending)),
          switchMap((pending) => paidObs),
          tap((paid) => this.studentPaidInvoice$.next(paid)),
          finalize(() => this.loadingService.dismiss())
        )
        .subscribe((val) => {});
    });
  }
  initFeesPage() {
    const selectedStudent: GetSDetailStudents = JSON.parse(
      localStorage.getItem('selectedStudent')!
    );
    const body: StudentDetailsForm = {
      Facility_Reg_Sno: selectedStudent.Facility_Reg_Sno,
      Admission_No: selectedStudent.Admission_No,
      From_Date: undefined,
      To_Date: undefined,
    };
    this.requestStudentFees(body);
  }
}
