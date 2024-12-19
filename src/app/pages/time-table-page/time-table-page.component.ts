import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  IonContent,
  IonText,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  NavController,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { GetSDetailStudents } from 'src/app/core/interfaces/GetSDetails';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { formatDate } from '@angular/common';
import { map, Subject } from 'rxjs';
import { GetTimeTable, Schedule } from 'src/app/core/interfaces/GetTimeTable';
import { StudentsManagementService } from 'src/app/services/students-management/students-management.service';
import { UnsubscriberService } from 'src/app/services/unsubscriber/unsubscriber.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import {
  ScheduleTypePipe,
  AvailableWeekdaysPipe,
  PeriodScheduleTypePipe,
  BreakScheduleTypePipe,
} from 'src/app/core/pipes/time-table/time-table.pipe';
import { AppUtilities } from 'src/app/core/utils/AppUtilities';
import { AppConfigService } from 'src/app/services/app-config/app-config.service';

@Component({
  selector: 'app-time-table-page',
  templateUrl: './time-table-page.component.html',
  styleUrls: ['./time-table-page.component.scss'],
  standalone: true,
  providers: [DatePipe],
  imports: [
    IonContent,
    IonText,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    TranslateModule,
    CommonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatDividerModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatListModule,
    ScheduleTypePipe,
    AvailableWeekdaysPipe,
    PeriodScheduleTypePipe,
    BreakScheduleTypePipe,
  ],
})
export class TimeTablePageComponent implements OnInit {
  //AppUtilities: typeof AppUtilities = AppUtilities;
  selectedStudent: GetSDetailStudents = JSON.parse(
    localStorage.getItem('selectedStudent')!
  );
  timeTableFormGroup!: FormGroup;
  timeTable$ = this.studentsService.timeTable$.asObservable();
  constructor(
    private fb: FormBuilder,
    private studentsService: StudentsManagementService,
    private unsubscribe: UnsubscriberService,
    private _appConfig: AppConfigService,
    private navCtrl: NavController
  ) {
    this.createTimeTaleFormGroup();
    this.backButtonHandler();
    this.timeTableFormGroup.valueChanges.subscribe({
      next: (form) => this.submitTimeTableForm(),
    });
  }
  private backButtonHandler() {
    const backToHome = () => this.navCtrl.navigateRoot('/tabs/tab-1/dashboard');
    this._appConfig.backButtonEventHandler(backToHome);
  }
  private mapToScheduleInstances(daySchedule: Schedule[] | null): Schedule[] {
    return daySchedule
      ? daySchedule.map((schedule) => {
          let lesson = new Schedule();
          lesson.Type = schedule.Type;
          lesson.Time = schedule.Time;
          lesson.Subject = schedule.Subject;
          lesson.Teacher = schedule.Teacher;
          return lesson;
        })
      : [];
  }
  private createTimeTaleFormGroup() {
    this.timeTableFormGroup = this.fb.group({
      Facility_Reg_Sno: this.fb.control(
        this.selectedStudent.Facility_Reg_Sno.toString(),
        []
      ),
      Admission_No: this.fb.control(
        this.selectedStudent.Admission_No.toString(),
        []
      ),
      From_Date: this.fb.control('', []),
      To_Date: this.fb.control(this.getTimeTableInitialToDate(), []),
    });
  }
  private getTimeTableInitialToDate() {
    let yyyyRegex = /^\d{4}$/;
    let yyyyToYyyyRegex = /^\d{4}-\d{4}$/;
    let academicYear = -1;
    if (yyyyRegex.test(this.selectedStudent.Acad_Year)) {
      academicYear = Number(this.selectedStudent.Acad_Year);
    } else if (yyyyToYyyyRegex.test(this.selectedStudent.Acad_Year)) {
      let year = this.selectedStudent.Acad_Year.substring(
        this.selectedStudent.Acad_Year.indexOf('-') + 1
      );
      academicYear = Number(year);
    } else {
      throw Error('Academic Year does not match format');
    }
    return new Date(academicYear, 10, 17);
  }
  ngOnInit() {
    if (!this.selectedStudent) throw Error('Failed to find selected student.');
    this.studentsService.requestTimeTable(this.timeTableFormGroup.value);
  }
  submitTimeTableForm() {
    if (this.timeTableFormGroup.valid) {
      this.studentsService.requestTimeTable(this.timeTableFormGroup.value);
    } else {
      this.timeTableFormGroup.markAllAsTouched();
    }
  }
  get Facility_Reg_Sno() {
    return this.timeTableFormGroup.get('Facility_Reg_Sno') as FormControl;
  }
  get Admission_No() {
    return this.timeTableFormGroup.get('Admission_No') as FormControl;
  }
  get From_Date() {
    return this.timeTableFormGroup.get('From_Date') as FormControl;
  }
  get To_Date() {
    return this.timeTableFormGroup.get('To_Date') as FormControl;
  }
}
