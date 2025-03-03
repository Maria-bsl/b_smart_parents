import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import {
  IonText,
  IonBackButton,
  IonButtons,
  IonContent,
  IonTitle,
  NavController,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { GetSDetailStudents } from 'src/app/core/interfaces/GetSDetails';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRippleModule } from '@angular/material/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AppConfigService } from 'src/app/services/app-config/app-config.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { finalize, Observable, of, tap, zip } from 'rxjs';
import { UnsubscriberService } from 'src/app/services/unsubscriber/unsubscriber.service';
import { UsersManagementService } from 'src/app/services/users-management/users-management.service';
import { DashboardModule } from 'src/app/core/types/dashboard-module';
import { DashboardService } from 'src/app/services/pages/dashboard-service/dashboard.service';
import { AccumulateStudentInvoicePipe } from 'src/app/core/pipes/accumulate-student-invoice/accumulate-student-invoice.pipe';
import { ApiConfigService } from 'src/app/services/api-config/api-config.service';
import { LoadingService } from 'src/app/services/loading-service/loading.service';
import { OverallAttendance } from 'src/app/core/types/attendance';
import { StudentPendingInvoice } from 'src/app/core/types/student-invoices';
import { FTimeTableForm as StudentDetailsForm } from 'src/app/core/forms/f-time-table-form';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonTitle,
    IonContent,
    IonText,
    TranslateModule,
    MatToolbarModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatRippleModule,
    RouterLink,
    AccumulateStudentInvoicePipe,
    IonBackButton,
    IonButtons,
  ],
})
export class DashboardPageComponent implements OnInit {
  overallAttendance$: Observable<OverallAttendance[]> =
    this.dashboardService.overallAttendance$.asObservable();
  pendingStudentInvoices$: Observable<StudentPendingInvoice[]> =
    this.dashboardService.pendingStudentInvoices$.asObservable();
  constructor(
    private appConfig: AppConfigService,
    private navCtrl: NavController,
    public dashboardService: DashboardService,
    private loadingService: LoadingService,
    private apiService: ApiConfigService,
    private unsubscribe: UnsubscriberService
  ) {
    this.registerIcons();
    this.dashboardService.initDashboard();
  }
  private registerIcons() {
    this.appConfig.addIcons(['book-open'], `/assets/feather`);
    this.appConfig.addIcons(
      [
        'student-person-svgrepo-com',
        'black-and-white-credit-cards-svgrepo-com',
      ],
      `/assets/svgrepo`
    );
    this.appConfig.addIcons(
      [
        'person-fill',
        'book-fill',
        'calendar-date-fill',
        'file-earmark-bar-graph-fill',
        'bell-fill',
        'calendar-check-fill',
        'lock-fill',
        'headset',
        'box-arrow-right',
        'door-open-fill',
        'bookshelf',
        'people-fill',
      ],
      `/assets/bootstrap-icons`
    );
    this.appConfig.addIcons(
      ['ic_holiday', 'ic_holiday_blue', 'fees-vector', 'ic_holiday_purple'],
      `/assets/figma`
    );
  }
  ngOnInit() {}
  requestEventDetails(event: MouseEvent) {
    this.loadingService
      .startLoading()
      .then((loading) => {
        let body = {
          Facility_Reg_Sno:
            this.dashboardService.selectedStudent.Facility_Reg_Sno,
          Admission_No: this.dashboardService.selectedStudent.Admission_No,
        };
        this.apiService
          .getEventList(body)
          .pipe(
            this.unsubscribe.takeUntilDestroy,
            finalize(() => this.loadingService.dismiss())
          )
          .subscribe({
            next: (res) => {
              this.appConfig.openAlertMessageBox(
                'defaults.info',
                res[0].Status
              );
            },
            error: (err) => console.error('Failed to fetch event details', err),
          });
      })
      .catch((err) => console.error(err));
  }
  navigateToHomeScreen() {
    this.navCtrl.navigateRoot('/home');
  }
  logoutClicked(event: any) {
    this.dashboardService.logUserOut();
  }
}
