import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DomSanitizer } from '@angular/platform-browser';
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
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { LottieComponent } from 'ngx-lottie';
import { GetSDetailStudents } from 'src/app/core/interfaces/GetSDetails';
import { StudentsManagementService } from 'src/app/services/students-management/students-management.service';
import { IonRouterOutlet } from '@ionic/angular/standalone';
import { Observable } from 'rxjs';
import { IStudentMarks } from 'src/app/core/interfaces/StudentMarks';
import { UnsubscriberService } from 'src/app/services/unsubscriber/unsubscriber.service';
import { inOutAnimation } from 'src/app/core/shared/fade-in-out-animation';
import { AppConfigService } from 'src/app/services/app-config/app-config.service';

@Component({
  selector: 'app-results-page',
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.scss'],
  standalone: true,
  animations: [inOutAnimation],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
    LottieComponent,
    MatRippleModule,
    MatIconModule,
    IonRouterOutlet,
  ],
})
export class ResultsPageComponent implements OnInit {
  studentMarks$: Observable<IStudentMarks | null> =
    this.studentService.studentMarks$.asObservable();
  options: AnimationOptions = {
    path: '/assets/lottie/snail-lottie.json',
  };
  styles: Partial<CSSStyleDeclaration> = {
    maxWidth: '500px',
    margin: '-90px auto',
  };
  examTypeListRoute: string = '/tabs/tab-1/results';
  constructor(
    private studentService: StudentsManagementService,
    private _appConfig: AppConfigService,
    private navCtrl: NavController
  ) {
    this.backButtonHandler();
  }
  private backButtonHandler() {
    const backToHome = () => this.navCtrl.navigateRoot('/tabs/tab-1/dashboard');
    this._appConfig.backButtonEventHandler(backToHome);
  }
  ngOnInit() {}
  getCurrentPath() {
    return this._appConfig.getCurrentPath();
  }
  onAnimate(animationItem: AnimationItem) {}
}
