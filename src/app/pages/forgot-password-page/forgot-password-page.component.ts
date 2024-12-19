import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  IonContent,
  IonIcon,
  IonText,
  IonButton,
  IonButtons,
  IonBackButton,
  NavController,
} from '@ionic/angular/standalone';
import { AppConfigService } from 'src/app/services/app-config/app-config.service';
import { addIcons } from 'ionicons';
import { keyOutline } from 'ionicons/icons';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HasFormControlErrorPipe } from 'src/app/core/pipes/has-form-control-error/has-form-control-error.pipe';
import { LoadingService } from 'src/app/services/loading-service/loading.service';
import { ApiConfigService } from 'src/app/services/api-config/api-config.service';
import { UnsubscriberService } from 'src/app/services/unsubscriber/unsubscriber.service';
import { finalize } from 'rxjs';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonText,
    IonIcon,
    IonContent,
    IonButton,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    TranslateModule,
    ReactiveFormsModule,
    HasFormControlErrorPipe,
    MatToolbarModule,
    IonBackButton,
  ],
})
export class ForgotPasswordPageComponent implements OnInit {
  formGroup!: FormGroup;
  constructor(
    private _appConfig: AppConfigService,
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private _apiService: ApiConfigService,
    private unsubscribe: UnsubscriberService,
    private router: Router,
    private navCtrl: NavController
  ) {
    this.registerAngularMaterialIcons();
    this.registerIonicIcons();
    this.createFormGroup();
    this.backButtonHandler();
  }
  private backButtonHandler() {
    const backToHome = () => this.navCtrl.navigateRoot('/login');
    this._appConfig.backButtonEventHandler(backToHome);
  }
  private createFormGroup() {
    this.formGroup = this.fb.group({
      Email_Address: this.fb.control('', [Validators.required]),
    });
  }
  private registerAngularMaterialIcons() {
    let icons = ['key', 'chevron-left'];
    let bootstrapIcons = ['book-fill'];

    this._appConfig.addIcons(icons, '/assets/feather');
    this._appConfig.addIcons(bootstrapIcons, '/assets/bootstrap-icons');
  }
  private registerIonicIcons() {
    addIcons({ keyOutline });
  }
  private requestForgotPassword(body: { Email_Address: string }) {
    this.loadingService.startLoading().then((loading) => {
      this._apiService
        .sendForgotPasswordLink(body)
        .pipe(
          this.unsubscribe.takeUntilDestroy,
          finalize(() => this.loadingService.dismiss())
        )
        .subscribe({
          next: (res) => this.router.navigate(['/login']),
          error: (err) => {
            console.error(err.message);
            this._appConfig.displayErrorOccurredText();
          },
        });
    });
  }
  ngOnInit() {}
  submitForm(event: MouseEvent) {
    if (this.formGroup.valid) {
      this.requestForgotPassword(this.formGroup.value);
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
  get Email_Address() {
    return this.formGroup.get('Email_Address') as FormControl;
  }
}
