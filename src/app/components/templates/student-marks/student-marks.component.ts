import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GetSDetailStudents } from 'src/app/core/interfaces/GetSDetails';
import { StudentsManagementService } from 'src/app/services/students-management/students-management.service';
import { IonText, IonButton, IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { UnsubscriberService } from 'src/app/services/unsubscriber/unsubscriber.service';
import { FStudentMarksForm } from 'src/app/core/forms/f-student-marks-form';
import { finalize, firstValueFrom, lastValueFrom, Observable, zip } from 'rxjs';
import {
  IStudentMarks,
  IStudentMarksDetail,
} from 'src/app/core/interfaces/StudentMarks';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  AboveAveragePipe,
  BelowAveragePipe,
  GreatAveragePipe,
} from 'src/app/core/pipes/results-marks/results-marks.pipe';
import { MatCard, MatCardModule } from '@angular/material/card';
import { addIcons } from 'ionicons';
import { downloadOutline } from 'ionicons/icons';
import { JspdfUtilsService } from 'src/app/services/jsdpdf-utils/jspdf-utils.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import jsPDF from 'jspdf';
import { LoadingService } from 'src/app/services/loading-service/loading.service';
import { ApiConfigService } from 'src/app/services/api-config/api-config.service';
import { FTimeTableForm as StudentDetailsForm } from 'src/app/core/forms/f-time-table-form';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  FileOpener,
  FileOpenerOptions,
} from '@capacitor-community/file-opener';

@Component({
  selector: 'app-student-marks',
  templateUrl: './student-marks.component.html',
  styleUrls: ['./student-marks.component.scss'],
  standalone: true,
  imports: [
    IonText,
    CommonModule,
    TranslateModule,
    AboveAveragePipe,
    BelowAveragePipe,
    GreatAveragePipe,
    MatCardModule,
    IonButton,
    IonIcon,
  ],
})
export class StudentMarksComponent implements AfterViewInit, OnInit {
  //@ViewChild(MatCard, { read: ElementRef }) resultsList2!: ElementRef;
  @ViewChild('resultsList') resultsList!: ElementRef<HTMLDivElement>;
  selectedStudent: GetSDetailStudents = JSON.parse(
    localStorage.getItem('selectedStudent')!
  );
  studentMarks$: Observable<IStudentMarks | null> =
    this.studentsService.studentMarks$.asObservable();
  studentMarksDetails$: Observable<IStudentMarksDetail[] | null> =
    this.studentsService.studentMarksDetails$.asObservable();
  constructor(
    private studentsService: StudentsManagementService,
    private activatedRoute: ActivatedRoute,
    private unsubscribe: UnsubscriberService,
    private jsPdfService: JspdfUtilsService,
    private apiService: ApiConfigService,
    private tr: TranslateService,
    private loadingService: LoadingService,
    private _snackBar: MatSnackBar
  ) {
    addIcons({ downloadOutline });
  }
  private readExamTypeFromActivatedRoute() {
    this.activatedRoute.params
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (params) => {
          let examType = atob(params['examType']);
          let form = this.createStudentMarksForm(examType);
          this.studentsService.requestStudentMarksAndMarksDetails(form);
        },
      });
  }
  private createStudentMarksForm(examType: string) {
    const form: FStudentMarksForm = {
      Facility_Reg_Sno: this.selectedStudent.Facility_Reg_Sno.toString(),
      Admission_No: this.selectedStudent.Admission_No,
      Exam_Type_Sno: examType,
    };
    return form;
  }
  private async writeAndDownloadReport(
    studentName: string,
    labels: string[],
    element: any
  ) {
    this.loadingService.startLoading().then(async (loading) => {
      let details = await firstValueFrom(this.studentMarks$);
      let doc = new jsPDF(
        element.clientWidth > element.clientHeight ? 'l' : 'p',
        'mm',
        [element.clientWidth, element.clientHeight]
      );
      await this.jsPdfService.exportJsPdfToPdf(
        doc,
        element,
        `${studentName}_marks`.concat('-')
      );
      this.loadingService.dismiss();
      let downloadedMessage = this.tr.get('defaults.labels.fileDownloaded');
      let viewMessage = this.tr.get('defaults.view');
      let merged = zip(downloadedMessage, viewMessage);
      merged.pipe(this.unsubscribe.takeUntilDestroy).subscribe({
        next: (messages) => {
          let [msg1, msg2] = messages;
          let snackbar = this._snackBar.open(msg1, msg2, { duration: 5000 });
          snackbar
            .onAction()
            .pipe(this.unsubscribe.takeUntilDestroy)
            .subscribe({
              next: (res) => {
                let uri$ = this.jsPdfService.getFileUri(
                  `${studentName}_marks`.concat('-')
                );
                uri$.pipe(this.unsubscribe.takeUntilDestroy).subscribe({
                  next: (file) => {
                    const fileOpenerOptions: FileOpenerOptions = {
                      filePath: file.uri,
                      contentType: 'application/pdf',
                      openWithDefault: true,
                    };
                    FileOpener.open(fileOpenerOptions);
                  },
                  error: (err) => console.error(`Failed to get file uri`, err),
                });
              },
              error: (err) => console.error(err),
            });
        },
        error: (err) => console.error(err),
      });
    });
  }
  ngOnInit() {
    this.readExamTypeFromActivatedRoute();
  }
  ngAfterViewInit(): void {}
  downloadStudentMarks() {
    this.tr
      .get('resultsPage.studentMarksDetailsReport')
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (res) => {
          const studentName = this.selectedStudent.SFullName;
          const labels = [res.studentName, res.finalGrade, res.overall];
          this.writeAndDownloadReport(
            studentName,
            labels,
            this.resultsList.nativeElement
          );
        },
      });
  }
}
