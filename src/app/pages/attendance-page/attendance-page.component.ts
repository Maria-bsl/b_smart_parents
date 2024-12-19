import { CommonModule, DatePipe } from '@angular/common';
import { Component, model, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatCalendarCellClassFunction,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonButtons,
  IonBackButton,
  IonText,
  NavController,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { firstValueFrom, map } from 'rxjs';
import { ApiConfigService } from 'src/app/services/api-config/api-config.service';
import { AppConfigService } from 'src/app/services/app-config/app-config.service';
import { AttendancePageService } from 'src/app/services/pages/attendance-page-service/attendance-page-service.service';
import * as moment from 'moment';
import { AttendanceScore } from 'src/app/core/types/attendance';
import { UnsubscriberService } from 'src/app/services/unsubscriber/unsubscriber.service';

@Component({
  selector: 'app-attendance-page',
  templateUrl: './attendance-page.component.html',
  styleUrls: ['./attendance-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    MatToolbarModule,
    IonButtons,
    IonBackButton,
    TranslateModule,
    MatCardModule,
    MatDatepickerModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [DatePipe],
})
export class AttendancePageComponent implements OnInit {
  attendanceScore$ = this.attendanceService.attendanceScore$
    .asObservable()
    .pipe(
      map((scores) =>
        scores.map((s) => {
          return {
            ...s,
            StartDate: (() => {
              let p = this.months.find(
                (m) =>
                  m.month?.toLocaleLowerCase() === s.Month.toLocaleLowerCase()
              );
              if (p) {
                //return new Date(Number(s.Year), p.index, 1);
                return this.getMonthStartAndEndDates(Number(s.Year), p.index)
                  .startDate;
              }
              return null;
            })(),
            EndDate: (() => {
              let p = this.months.find(
                (m) =>
                  m.month?.toLocaleLowerCase() === s.Month.toLocaleLowerCase()
              );
              if (p) {
                return this.getMonthStartAndEndDates(Number(s.Year), p.index)
                  .endDate;
              }
              return null;
            })(),
          };
        })
      )
    );
  selected = model<Date | null>(new Date());
  months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    .map((x) => new Date(new Date().getFullYear(), x, 1))
    .map((m, index) => {
      return {
        month: this.datePipe.transform(m, 'MMMM'),
        index: index,
      };
    });
  currentIndex: number = 0;
  constructor(
    private attendanceService: AttendancePageService,
    private datePipe: DatePipe,
    private _appConfig: AppConfigService,
    private unsubscribe: UnsubscriberService,
    private navCtrl: NavController
  ) {
    this.registerIcons();
    this.backButtonHandler();
  }
  private registerIcons() {
    const icons = ['chevron-left', 'chevron-right'];
    this._appConfig.addIcons(icons, '/assets/bootstrap-icons');
  }
  private backButtonHandler() {
    const backToHome = () => this.navCtrl.navigateRoot('/tabs/tab-1/dashboard');
    this._appConfig.backButtonEventHandler(backToHome);
  }
  private getMonthStartAndEndDates(
    year: number,
    month: number
  ): { startDate: Date; endDate: Date } {
    if (month < 0 || month > 11) {
      throw new Error(
        'Invalid month. Month should be a value between 1 and 12.'
      );
    }
    const startDate = moment([year, month]).toDate();
    const endDate = moment(startDate).endOf('month').toDate();

    return { startDate, endDate };
  }
  ngOnInit() {
    //this.attendanceService.requestAttendanceScore();
  }
  scrollToItem(event: Event, itemId: string): void {
    event.preventDefault();
    const element = document.getElementById(itemId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  nextScore(event: Event) {
    // if (this.currentIndex < scores.length - 1) {
    //   this.currentIndex++;
    //   this.scrollToItem(event, `slide-${this.currentIndex}`);
    // }
    const scrollToItem = (scores: any[]) => {
      if (this.currentIndex < scores.length - 1) {
        this.currentIndex++;
        this.scrollToItem(event, `slide-${this.currentIndex}`);
      }
    };
    this.attendanceScore$.pipe(this.unsubscribe.takeUntilDestroy).subscribe({
      next: (scores) => scrollToItem(scores),
      error: (err) => console.error,
    });
  }
  prevScore(event: Event) {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.scrollToItem(event, `slide-${this.currentIndex}`);
    }
  }
}
