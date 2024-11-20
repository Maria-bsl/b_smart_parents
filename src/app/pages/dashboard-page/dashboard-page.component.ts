import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import {
  IonBackButton,
  IonText,
  IonButtons,
  IonContent,
  IonTitle,
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
import { RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { zip } from 'rxjs';
import { UnsubscriberService } from 'src/app/services/unsubscriber/unsubscriber.service';
import { UsersManagementService } from 'src/app/services/users-management/users-management.service';
import { DashboardModule } from 'src/app/core/types/dashboard-module';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    CdkDropList,
    CdkDrag,
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
  ],
})
export class DashboardPageComponent implements OnInit {
  selectedStudent: GetSDetailStudents = JSON.parse(
    localStorage.getItem('selectedStudent')!
  );
  constructor(
    private appConfig: AppConfigService,
    private tr: TranslateService,
    private _unsubscriber: UnsubscriberService,
    private usersService: UsersManagementService
  ) {
    this.registerIcons();
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
      ],
      `/assets/bootstrap-icons`
    );
    this.appConfig.addIcons(['ic_holiday', 'ic_holiday_blue'], `/assets/figma`);
  }
  ngOnInit() {}
  logoutClicked(event: any) {
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
