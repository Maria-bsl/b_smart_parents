import { Component, OnInit, signal } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonText,
  IonIcon,
  IonButton,
  IonBackButton,
  IonButtons,
  IonNav,
  NavController,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule } from '@angular/material/core';
import {
  GetSDetails,
  GetSDetailStudents,
} from 'src/app/core/interfaces/GetSDetails';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer } from '@angular/platform-browser';
import { UsersManagementService } from 'src/app/services/users-management/users-management.service';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppConfigService } from 'src/app/services/app-config/app-config.service';
import { LoadingService } from 'src/app/services/loading-service/loading.service';
import { FDeleteStudent } from 'src/app/core/forms/f-add-student';
import { ApiConfigService } from 'src/app/services/api-config/api-config.service';
import { UnsubscriberService } from 'src/app/services/unsubscriber/unsubscriber.service';
import { finalize, firstValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';
import { FLoginForm } from 'src/app/core/forms/f-login-form';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { ProfilePageComponent } from '../profile-page/profile-page.component';
import NodeRSA from 'encrypt-rsa';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonBackButton,
    IonButton,
    CommonModule,
    IonContent,
    TranslateModule,
    IonText,
    MatCardModule,
    MatListModule,
    MatRippleModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatBottomSheetModule,
    RouterLink,
  ],
})
export class HomePage implements OnInit {
  studentDetails = signal<GetSDetails>(
    JSON.parse(localStorage.getItem('GetSDetails')!)
  );
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiConfigService,
    private loadingService: LoadingService,
    private usersService: UsersManagementService,
    private unsubscribe: UnsubscriberService,
    private router: Router,
    private tr: TranslateService,
    private _bottomSheet: MatBottomSheet,
    private navCtrl: NavController
  ) {
    this.registerIcons();
  }
  private registerIcons() {
    let icons = ['door-open-fill', 'trash-fill', 'person-fill', 'box-fill'];
    this.appConfig.addIcons(icons, '/assets/bootstrap-icons');
    this.appConfig.addIcons(['plus'], '/assets/feather');
  }
  private failedToGetStudentDetails() {
    let failedMessageObs = 'defaults.failed';
    let errorOccuredMessageObs = 'homePage.errors.failedToRetrieveStudent';
    this.appConfig.openAlertMessageBox(
      failedMessageObs,
      errorOccuredMessageObs
    );
  }
  private getStudentDetails(body: FLoginForm) {
    this.loadingService.startLoading().then((loading) => {
      this.apiService
        .signIn({
          User_Name: localStorage.getItem('User_Name')!,
          Password: localStorage.getItem('Password')!,
        })
        .pipe(
          this.unsubscribe.takeUntilDestroy,
          finalize(() => this.loadingService.dismiss())
        )
        .subscribe({
          next: (res: any) => {
            if (Object.prototype.hasOwnProperty.call(res[0], 'status')) {
              let failedMessageObs = 'defaults.failed';
              let incorrectUsernamePasswordMessageObs =
                'loginPage.loginForm.messageBox.errors.usernamePasswordIncorrect';
              this.appConfig.openAlertMessageBox(
                failedMessageObs,
                incorrectUsernamePasswordMessageObs
              );
            } else {
              let GetSDetails = JSON.stringify(res[0]);
              localStorage.setItem('GetSDetails', GetSDetails);
              this.studentDetails.set(
                JSON.parse(localStorage.getItem('GetSDetails')!)
              );
            }
          },
          error: (err) => {
            this.failedToGetStudentDetails();
          },
        });
    });
  }
  ngOnInit(): void {
    localStorage.removeItem('selectedStudent');
  }
  openAddStudentPage() {
    this.router.navigate(['/add-student']);
  }
  openNavigationsPages(event: any, student: GetSDetailStudents) {
    this.loadingService.startLoading().then((loading) => {
      setTimeout(() => {
        this.loadingService.dismiss();
        localStorage.setItem('selectedStudent', JSON.stringify(student));
        //this.router.navigate(['/tabs/tab-1/dashboard'], { replaceUrl: true });
        this.navCtrl.navigateBack('/tabs/tab-1/dashboard');
      }, 2000);
    });
  }
  async removeStudent(event: any, student: GetSDetailStudents) {
    const deleteStudent = (body: FDeleteStudent) => {
      this.loadingService.startLoading().then((loading) => {
        this.apiService
          .deleteStudent(body)
          .pipe(
            this.unsubscribe.takeUntilDestroy,
            finalize(() => this.loadingService.dismiss())
          )
          .subscribe({
            next: async (result) => {
              let keys = Object.keys(result[0]);
              if (
                keys.includes('Status') &&
                result[0]['Status'] === 'Deleted'
              ) {
                let text = await firstValueFrom(
                  this.tr.get('homePage.labels.deleted')
                );
                toast.success(text);
                this.getStudentDetails({
                  User_Name: localStorage.getItem('User_Name')!,
                  Password: localStorage.getItem('Password')!,
                });
              } else {
                let text = await firstValueFrom(
                  this.tr.get('homePage.errors.failedToDeleteStudent')
                );
                toast.error(text);
              }
              this.loadingService.dismiss();
            },
          });
      });
    };
    let title = await firstValueFrom(
      this.tr.get('homePage.labels.deleteStudent')
    );
    let message = await firstValueFrom(
      this.tr.get('homePage.warnings.cantBeUndone')
    );
    let dialogRef = this.appConfig.openConfirmMessageBox(title, message);
    dialogRef.componentInstance.confirmed.asObservable().subscribe({
      next: (res) => {
        let body: FDeleteStudent = {
          Facility_Reg_Sno: student.Facility_Reg_Sno,
          User_Name: student.User_Name,
          Admission_No: student.Admission_No,
          Reason_Del: 'Parent Deleted Account',
        };
        deleteStudent(body);
      },
    });
  }
  logOutClicked(event: any) {
    this.usersService.logOutUser();
  }
  openProfilePage() {
    this._bottomSheet.open(ProfilePageComponent, {
      panelClass: 'bottom-sheet-panel',
    });
  }
}
