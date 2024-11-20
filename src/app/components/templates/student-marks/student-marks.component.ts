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
import { firstValueFrom, lastValueFrom, Observable } from 'rxjs';
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
  @ViewChild(MatCard, { read: ElementRef }) resultsList!: ElementRef;
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
    private tr: TranslateService
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
          this.studentsService.downloadStudentMarksDetailsReport(
            studentName,
            labels,
            this.resultsList.nativeElement
          );
        },
      });
  }
}
