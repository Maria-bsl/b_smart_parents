import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../api-config/api-config.service';
import { BehaviorSubject, finalize } from 'rxjs';
import { AttendanceScore } from 'src/app/core/types/attendance';
import { AppConfigService } from '../../app-config/app-config.service';
import { FTimeTableForm as StudentDetailsForm } from 'src/app/core/forms/f-time-table-form';
import { GetSDetailStudents } from 'src/app/core/interfaces/GetSDetails';
import { UnsubscriberService } from '../../unsubscriber/unsubscriber.service';
import { LoadingService } from '../../loading-service/loading.service';

@Injectable({
  providedIn: 'root',
})
export class AttendancePageService {
  selectedStudent: GetSDetailStudents = JSON.parse(
    localStorage.getItem('selectedStudent')!
  );
  attendanceScore$ = new BehaviorSubject<AttendanceScore[]>([]);
  constructor(
    private apiService: ApiConfigService,
    private appConfig: AppConfigService,
    private unsubscribe: UnsubscriberService,
    private loadingService: LoadingService
  ) {}
  requestAttendanceScore() {
    const body: StudentDetailsForm = {
      Facility_Reg_Sno: this.selectedStudent.Facility_Reg_Sno,
      Admission_No: this.selectedStudent.Admission_No,
      From_Date: undefined,
      To_Date: undefined,
    };
    this.loadingService.startLoading().then((loading) => {
      this.apiService
        .getAttendanceScore(body)
        .pipe(
          this.unsubscribe.takeUntilDestroy,
          finalize(() => this.loadingService.dismiss())
        )
        .subscribe({
          next: (results) => {
            this.attendanceScore$.next(results);
          },
        });
    });
  }
}
