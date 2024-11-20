import { CommonModule } from '@angular/common';
import { Component, OnInit, Output } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink, RouterModule } from '@angular/router';
import { IonText } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { IExamType } from 'src/app/core/interfaces/ExamType';
import { GetSDetailStudents } from 'src/app/core/interfaces/GetSDetails';
import { ToBase64Pipe } from 'src/app/core/pipes/results-marks/results-marks.pipe';
import { StudentsManagementService } from 'src/app/services/students-management/students-management.service';

@Component({
  selector: 'app-exam-types-list',
  templateUrl: './exam-types-list.component.html',
  styleUrls: ['./exam-types-list.component.scss'],
  standalone: true,
  imports: [
    IonText,
    CommonModule,
    MatListModule,
    MatIconModule,
    TranslateModule,
    MatRippleModule,
    RouterLink,
    ToBase64Pipe,
  ],
})
export class ExamTypesListComponent implements OnInit {
  examTypes$ = this.studentsService.examTypes$.asObservable();
  selectedStudent: GetSDetailStudents = JSON.parse(
    localStorage.getItem('selectedStudent')!
  );
  constructor(
    private studentsService: StudentsManagementService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.registerIcons();
  }
  private registerIcons() {
    let icons = ['chevron-right'];
    icons.forEach((icon) => {
      this.iconRegistry.addSvgIcon(
        icon,
        this.sanitizer.bypassSecurityTrustResourceUrl(
          `/assets/feather/${icon}.svg`
        )
      );
    });
  }
  ngOnInit() {
    this.studentsService.requestExamTypes({
      Facility_Reg_Sno: this.selectedStudent.Facility_Reg_Sno,
    });
  }
}
