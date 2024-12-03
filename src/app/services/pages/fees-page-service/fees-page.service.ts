import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../api-config/api-config.service';
import { FTimeTableForm as StudentDetailsForm } from 'src/app/core/forms/f-time-table-form';
import { GetSDetailStudents } from 'src/app/core/interfaces/GetSDetails';
import { AppConfigService } from '../../app-config/app-config.service';
import { BehaviorSubject, finalize, zip } from 'rxjs';
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
  selectedStudent: GetSDetailStudents = JSON.parse(
    localStorage.getItem('selectedStudent')!
  );
  constructor(
    private apiService: ApiConfigService,
    private unsubscribe: UnsubscriberService,
    private loadingService: LoadingService
  ) {}
  initFeesPage() {
    const body: StudentDetailsForm = {
      Facility_Reg_Sno: this.selectedStudent.Facility_Reg_Sno,
      Admission_No: this.selectedStudent.Admission_No,
      From_Date: undefined,
      To_Date: undefined,
    };
    this.loadingService.startLoading().then((loading) => {
      let invoicesObs = this.apiService.getStudentInvoices(body);
      let pendingObs = this.apiService.getStudentPendingInvoices(body);
      let paidObs = this.apiService.getStudentPaidInvoices(body);
      let merged = zip(invoicesObs, pendingObs, paidObs);
      merged
        .pipe(
          this.unsubscribe.takeUntilDestroy,
          finalize(() => this.loadingService.dismiss())
        )
        .subscribe({
          next: (results) => {
            let [invoices, pending, paid] = results;
            this.studentInvoices$.next(invoices);
            this.studentPendingInvoices$.next(pending);
            this.studentPaidInvoice$.next(paid);
          },
        });
    });
  }
}
