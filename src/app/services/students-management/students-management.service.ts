import { Injectable } from '@angular/core';
import { FTimeTableForm } from 'src/app/core/forms/f-time-table-form';
import { AppConfigService } from '../app-config/app-config.service';
import { ApiConfigService } from '../api-config/api-config.service';
import { UnsubscriberService } from '../unsubscriber/unsubscriber.service';
import { BehaviorSubject, finalize, Observable, Subject, zip } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { GetTimeTable, Schedule } from 'src/app/core/interfaces/GetTimeTable';
import { FExamType } from 'src/app/core/forms/f-exam-type';
import { IExamType } from 'src/app/core/interfaces/ExamType';
import { FStudentMarksForm } from 'src/app/core/forms/f-student-marks-form';
import {
  IStudentMarks,
  IStudentMarksDetail,
} from 'src/app/core/interfaces/StudentMarks';
import { Router } from '@angular/router';
import { LoadingService } from '../loading-service/loading.service';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root',
})
export class StudentsManagementService {
  timeTable$ = new Subject<GetTimeTable>();
  examTypes$ = new Subject<IExamType[]>();
  studentMarks$ = new BehaviorSubject<IStudentMarks | null>(null);
  studentMarksDetails$ = new BehaviorSubject<IStudentMarksDetail[] | null>([]);
  constructor(
    private appConfig: AppConfigService,
    private apiConfig: ApiConfigService,
    private unsubscribe: UnsubscriberService,
    private loadingService: LoadingService,
    private router: Router
  ) {}
  private displayFailedToFetchTimeTableError() {
    let failedMessageObs = 'defaults.failed';
    let errorOccuredMessageObs = 'timeTablePage.errors.failedToFetchTimeTable';
    this.appConfig.openAlertMessageBox(
      failedMessageObs,
      errorOccuredMessageObs
    );
  }
  private displayFailedToFetchExamTypes() {
    let failedMessageObs = 'defaults.failed';
    let errorOccuredMessageObs = 'resultsPage.errors.failedToFetchExamType';
    this.appConfig.openAlertMessageBox(
      failedMessageObs,
      errorOccuredMessageObs
    );
  }
  private failedToFindStudentMarks() {
    let failedMessageObs = 'defaults.failed';
    let errorOccuredMessageObs = 'resultsPage.errors.failedToFindStudentMarks';
    this.appConfig.openAlertMessageBox(
      failedMessageObs,
      errorOccuredMessageObs
    );
  }
  private noExamResultsFoundError() {
    let failedMessageObs = 'defaults.warning';
    let errorOccuredMessageObs = 'resultsPage.errors.noExamResultsFound';
    this.appConfig.openAlertMessageBox(
      failedMessageObs,
      errorOccuredMessageObs
    );
  }
  requestTimeTable(form: FTimeTableForm) {
    this.loadingService.startLoading().then((loading) => {
      this.apiConfig
        .getTimeTable(form)
        .pipe(
          this.unsubscribe.takeUntilDestroy,
          finalize(() => this.loadingService.dismiss())
        )
        .subscribe({
          next: (res: any) => {
            if (res && res.length > 0) {
              this.timeTable$.next(res[0]);
            }
          },
          error: (err) => {
            this.displayFailedToFetchTimeTableError();
          },
        });
    });
  }
  requestExamTypes(body: FExamType) {
    this.loadingService.startLoading().then((loading) => {
      this.apiConfig
        .getExamTypes(body)
        .pipe(
          this.unsubscribe.takeUntilDestroy,
          finalize(() => this.loadingService.dismiss())
        )
        .subscribe({
          next: (res: any) => {
            if (res && res.length > 0) {
              this.examTypes$.next(res);
            } else {
              this.displayFailedToFetchExamTypes();
            }
          },
          error: (err) => {
            this.displayFailedToFetchExamTypes();
          },
        });
    });
  }
  requestStudentMarksAndMarksDetails(body: FStudentMarksForm) {
    this.loadingService.startLoading().then((loading) => {
      let studentMarksObs = this.apiConfig.getStudentMarks(body);
      let studentMarkDetails = this.apiConfig.getStudentMarkDetails(body);
      let marksReq = zip(studentMarksObs, studentMarkDetails);
      marksReq
        .pipe(
          this.unsubscribe.takeUntilDestroy,
          finalize(() => this.loadingService.dismiss())
        )
        .subscribe({
          next: (results) => {
            let [marks, marksDetails] = results;
            if (marks && (marks as any[]).length > 0) {
              this.studentMarks$.next((marks as any[])[0] as IStudentMarks);
            }
            if (marksDetails && (marksDetails as any[]).length > 0) {
              this.studentMarksDetails$.next(
                marksDetails as any[] as IStudentMarksDetail[]
              );
            }
            if (
              !marks ||
              (marks as any[]).length === 0 ||
              !marksDetails ||
              (marksDetails as any[]).length === 0
            ) {
              this.noExamResultsFoundError();
              this.router.navigate(['/tabs/tab-1/results']);
            }
          },
          error: (err) => {
            this.failedToFindStudentMarks();
          },
        });
    });
  }
  // downloadStudentMarksDetailsReport(
  //   fullName: string,
  //   labels: string[],
  //   element: HTMLElement
  // ) {
  //   // let doc = new jsPDF(
  //   //   element.clientWidth > element.clientHeight ? 'l' : 'p',
  //   //   'mm',
  //   //   [element.clientWidth, element.clientHeight]
  //   // );
  //   // doc.html(element, {
  //   //   callback(doc) {
  //   //     doc.save('results.pdf');
  //   //   },
  //   // });
  // }
}
