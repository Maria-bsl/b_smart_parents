import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  IonContent,
  IonButtons,
  IonBackButton,
  IonText,
  NavController,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { finalize, Observable } from 'rxjs';
import { AvailableMobileNumbersRegex } from 'src/app/core/enums/available-mobile-numbers';
import { IUpdateParentReg } from 'src/app/core/forms/f-update-parent-reg';
import { IParentDetail } from 'src/app/core/interfaces/parent-details';
import { HasFormControlErrorPipe } from 'src/app/core/pipes/has-form-control-error/has-form-control-error.pipe';
import { ApiConfigService } from 'src/app/services/api-config/api-config.service';
import { AppConfigService } from 'src/app/services/app-config/app-config.service';
import { LoadingService } from 'src/app/services/loading-service/loading.service';
import { UnsubscriberService } from 'src/app/services/unsubscriber/unsubscriber.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButtons,
    IonBackButton,
    IonText,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule,
    ReactiveFormsModule,
    HasFormControlErrorPipe,
    CommonModule,
  ],
})
export class ProfilePageComponent implements OnInit {
  profileFormGroup!: FormGroup;
  parentDetails$!: Observable<IParentDetail>;
  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private apiService: ApiConfigService,
    private unsubscribe: UnsubscriberService,
    private _appConfig: AppConfigService,
    private navCtrl: NavController
  ) {
    this.backButtonHandler();
    this.createProfileGroup();
  }
  private backButtonHandler() {
    const backToHome = () => this.navCtrl.navigateRoot('/tabs/tab-1/dashboard');
    this._appConfig.backButtonEventHandler(backToHome);
  }
  private createProfileGroup() {
    this.profileFormGroup = this.fb.group({
      User_Name: this.fb.control(localStorage.getItem('User_Name')!, [
        Validators.required,
      ]),
      Parent_Name: this.fb.control('', [Validators.required]),
      Email_Address: this.fb.control('', [
        Validators.required,
        Validators.email,
      ]),
      Mobile_No: this.fb.control('', [
        Validators.required,
        Validators.pattern(
          AvailableMobileNumbersRegex.TANZANIA_MOBILE_NUMBER_REGEX
        ),
      ]),
    });
  }
  private setFormGroup(detail: IParentDetail) {
    const setMobileNumber = (mobile: string | null) => {
      if (mobile?.startsWith('0')) return mobile.substring(1);
      else if (mobile?.startsWith('255')) return mobile.substring(3);
      else return mobile;
    };
    this.Parent_Name.setValue(detail.Parent_Name);
    this.Email_Address.setValue(detail.Email_Address);
    this.Mobile_No.setValue(setMobileNumber(detail.Mobile_No));
  }
  private requestParentDetails() {
    this.loadingService
      .startLoading()
      .then((loading) => {
        let username = localStorage.getItem('User_Name');
        this.apiService
          .getParentDetails({ User_Name: this.User_Name.value })
          .pipe(
            this.unsubscribe.takeUntilDestroy,
            finalize(() => this.loadingService.dismiss())
          )
          .subscribe({
            next: (res) => {
              this.parentDetails$ = new Observable((subscriber) => {
                subscriber.next(res[0]);
                subscriber.complete();
              });
              this.setFormGroup(res[0]);
            },
            error: (err) =>
              console.error('Failed to fetch parent details', err),
          });
      })
      .catch((err) => console.error(err));
  }
  private requestUpdateProfile(body: IUpdateParentReg) {
    this.loadingService
      .startLoading()
      .then((loading) => {
        this.apiService
          .getUpdateParentDetail(body)
          .pipe(
            this.unsubscribe.takeUntilDestroy,
            finalize(() => this.loadingService.dismiss())
          )
          .subscribe({
            next: (res) => {
              let form = new Map(Object.entries(res[0]));
              let hasError = false;
              for (let [key, value] of form) {
                if (value !== null && key === 'Status') {
                  hasError = true;
                  this._appConfig.openAlertMessageBox(
                    'defaults.warning',
                    value
                  );
                }
              }
              !hasError && this.requestParentDetails();
            },
            error: (err) =>
              console.error('Failed to update parent profile', err),
          });
      })
      .catch((err) => console.error(err));
  }
  ngOnInit() {
    this.requestParentDetails();
  }
  getMobileNumber(mobile: string) {
    if (mobile.startsWith('0')) return mobile.substring(1);
    else if (mobile.startsWith('255')) return mobile.substring(3);
    else return mobile;
  }
  resetClicked(event: MouseEvent) {
    if (this.parentDetails$) {
      this.parentDetails$.subscribe({
        next: (details) => this.setFormGroup(details),
        error: (err) => console.error(err),
      });
    }
  }
  submitProfileForm(event: MouseEvent) {
    if (this.profileFormGroup.valid) {
      this.requestUpdateProfile(this.profileFormGroup.value);
    } else {
      this.profileFormGroup.markAllAsTouched();
    }
  }
  get User_Name() {
    return this.profileFormGroup.get('User_Name') as FormControl;
  }
  get Parent_Name() {
    return this.profileFormGroup.get('Parent_Name') as FormControl;
  }
  get Email_Address() {
    return this.profileFormGroup.get('Email_Address') as FormControl;
  }
  get Mobile_No() {
    return this.profileFormGroup.get('Mobile_No') as FormControl;
  }
}
