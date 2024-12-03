import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  IonContent,
  IonButtons,
  IonBackButton,
  IonText,
} from '@ionic/angular/standalone';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { ApiConfigService } from 'src/app/services/api-config/api-config.service';
import { AppConfigService } from 'src/app/services/app-config/app-config.service';
import { UnsubscriberService } from 'src/app/services/unsubscriber/unsubscriber.service';
import { LoadingService } from 'src/app/services/loading-service/loading.service';
import { GetSDetailStudents } from 'src/app/core/interfaces/GetSDetails';
import { FBookForm } from 'src/app/core/forms/f-time-table-form';
import { finalize, Observable, of, zip } from 'rxjs';
import { BookBorrowed, BookReturned } from 'src/app/core/types/library-book';
import { IsEmptyShelfPipe } from 'src/app/core/pipes/is-empty-shelf/is-empty-shelf.pipe';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-library-page',
  templateUrl: './library-page.component.html',
  styleUrls: ['./library-page.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButtons,
    IonText,
    IonBackButton,
    CommonModule,
    TranslateModule,
    MatToolbarModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    IsEmptyShelfPipe,
  ],
})
export class LibraryPageComponent implements OnInit {
  selectedStudent: GetSDetailStudents = JSON.parse(
    localStorage.getItem('selectedStudent')!
  );
  booksReturned$: Observable<BookReturned[] | { Status: string }[] | any> = of(
    []
  );
  booksBorrowed$: Observable<BookBorrowed[] | { Status: string }[] | any> = of(
    []
  );
  constructor(
    private apiService: ApiConfigService,
    private appConfig: AppConfigService,
    private unsubscribe: UnsubscriberService,
    private loadingService: LoadingService
  ) {
    this.appConfig.addIcons(['book-fill'], '/assets/bootstrap-icons');
  }
  private initPage() {
    let body: FBookForm = {
      Facility_Reg_Sno: this.selectedStudent.Facility_Reg_Sno,
      Admission_No: this.selectedStudent.Admission_No,
      Academic_Sno: this.selectedStudent.Academic_Sno,
    };
    this.loadingService.startLoading().then((loading) => {
      const booksReturned = this.apiService.getBooksReturned(body);
      const booksBorrowed = this.apiService.getBooksBorrowed(body);
      const merged = zip(booksReturned, booksBorrowed);
      merged
        .pipe(
          this.unsubscribe.takeUntilDestroy,
          finalize(() => this.loadingService.dismiss())
        )
        .subscribe({
          next: (results) => {
            let [returned, borrowed] = results;
            this.booksReturned$ = of(returned);
            this.booksBorrowed$ = of(borrowed);
          },
        });
    });
  }
  ngOnInit() {
    this.initPage();
  }
}
