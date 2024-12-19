import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  IonContent,
  IonButtons,
  IonBackButton,
  IonText,
  NavController,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { finalize, Observable, of } from 'rxjs';
import { GetSDetailStudents } from 'src/app/core/interfaces/GetSDetails';
import { ISubject, ISubjectBook } from 'src/app/core/interfaces/isubjects';
import { ApiConfigService } from 'src/app/services/api-config/api-config.service';
import { LoadingService } from 'src/app/services/loading-service/loading.service';
import { UnsubscriberService } from 'src/app/services/unsubscriber/unsubscriber.service';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  IsExistSubjectBooksPipe,
  IsNotNullSubjectBooksPipe,
} from 'src/app/core/pipes/books/books.pipe';
import { inOutAnimation } from 'src/app/core/shared/fade-in-out-animation';
import { AppConfigService } from 'src/app/services/app-config/app-config.service';

@Component({
  selector: 'app-books-page',
  templateUrl: './books-page.component.html',
  styleUrls: ['./books-page.component.scss'],
  standalone: true,
  animations: [inOutAnimation],
  imports: [
    IonContent,
    IonButtons,
    IonBackButton,
    IonText,
    MatToolbarModule,
    MatTabsModule,
    MatListModule,
    MatRippleModule,
    MatExpansionModule,
    TranslateModule,
    CommonModule,
    IsExistSubjectBooksPipe,
    IsNotNullSubjectBooksPipe,
  ],
})
export class BooksPageComponent implements OnInit {
  selectedStudent: GetSDetailStudents = JSON.parse(
    localStorage.getItem('selectedStudent')!
  );
  subjects$!: Observable<ISubject[]>;
  subjectBooks$: (Observable<ISubjectBook[]> | null)[] = [];
  constructor(
    private apiService: ApiConfigService,
    private loadingService: LoadingService,
    private unsubscribe: UnsubscriberService,
    private navCtrl: NavController,
    private _appConfig: AppConfigService
  ) {
    this.backButtonHandler();
  }
  private backButtonHandler() {
    const backToHome = () => this.navCtrl.navigateRoot('/tabs/tab-1/dashboard');
    this._appConfig.backButtonEventHandler(backToHome);
  }
  private requestBooksList() {
    this.loadingService
      .startLoading()
      .then((loading) => {
        this.apiService
          .getBooksList({
            Facility_Reg_Sno: this.selectedStudent.Facility_Reg_Sno,
          })
          .pipe(
            this.unsubscribe.takeUntilDestroy,
            finalize(() => this.loadingService.dismiss())
          )
          .subscribe({
            next: (res) => {
              this.subjectBooks$ = Array.from(
                { length: res.length },
                () => null
              );
              this.subjects$ = new Observable((subscriber) => {
                subscriber.next(res);
                subscriber.complete();
              });
            },
            error: (err) => console.error('Failed to get books list', err),
          });
      })
      .catch((err) => console.error('Failed to open loading', err));
  }
  ngOnInit() {
    this.requestBooksList();
  }
  requestSubjectBooks(subjectSno: number, index: number) {
    if (this.subjectBooks$.at(index)) return;
    this.apiService
      .getBookDetailsList({
        Facility_Reg_Sno: this.selectedStudent.Facility_Reg_Sno,
        Subject_Sno: subjectSno,
      })
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (res) => {
          try {
            if (index < 0 || index >= this.subjectBooks$.length)
              throw Error('Index out of bounds');
            const obs = new Observable<ISubjectBook[]>((subscriber) => {
              subscriber.next(res);
              subscriber.complete();
            });
            this.subjectBooks$[index] = obs;
          } catch (err) {
            console.error(err);
          }
        },
        error: (err) => console.error('Failed to fetch book details', err),
      });
  }
}
