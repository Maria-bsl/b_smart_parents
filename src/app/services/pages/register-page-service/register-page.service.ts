import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AvailableMobileNumbersRegex } from 'src/app/core/enums/available-mobile-numbers';
import { FacilitiesService } from '../../facilities/facilities.service';
import {
  BehaviorSubject,
  finalize,
  firstValueFrom,
  map,
  Observable,
  of,
  startWith,
  switchMap,
  tap,
  zip,
} from 'rxjs';
import { GetFacilities } from 'src/app/core/interfaces/GetFacilities';
import { UnsubscriberService } from '../../unsubscriber/unsubscriber.service';
import { AppConfigService } from '../../app-config/app-config.service';
import { RegisterAccountInfoService } from '../../register-account-info-service/register-account-info.service';
import { StudentDetailsFormService } from '../../student-details-form-service/student-details-form.service';
import { ApiConfigService } from '../../api-config/api-config.service';
import { FRegisterParent } from 'src/app/core/forms/f-add-student';
import { Router } from '@angular/router';
import { AppLauncher } from '@capacitor/app-launcher';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { isPlatform } from '@ionic/angular/standalone';
import {
  ExternalLinks,
  PackageNames,
} from 'src/app/core/interfaces/package-names';

@Injectable({
  providedIn: 'root',
})
export class RegisterPageService {
  constructor(
    public registerParentAccountInfoService: RegisterAccountInfoService,
    public studentDetailsService: StudentDetailsFormService,
    private appConfig: AppConfigService,
    private apiService: ApiConfigService,
    private unsubscribe: UnsubscriberService,
    private router: Router,
    private tr: TranslateService
  ) {}
  private validateRegistrationForm() {
    let errors = { title: 'defaults.errors.invalidForm', message: '' };
    this.registerParentAccountInfoService.validateForm(errors);
    this.studentDetailsService.validateForm(errors);
    errors.message
      ? this.appConfig.openAlertMessageBox(errors.title, errors.message)
      : (() => {})();
  }
  private resetForm() {
    this.registerParentAccountInfoService.parentForm.reset();
    this.studentDetailsService.studentForm.reset();
  }
  private registrationSuccessHandler() {
    const swalIsDismissed = () => {
      this.appConfig.startLoading().then((loading) => {
        setTimeout(() => {
          this.resetForm();
          loading.dismiss();
          this.router.navigate(['/login']);
        }, 800);
      });
    };
    const swalIsConfirmed = () => {
      this.resetForm();
      this.router.navigate(['/login']);
      if (isPlatform('capacitor')) {
        this.appConfig.launchApp(PackageNames.GOOGLE_EMAIL);
      } else {
        this.appConfig.openExternalLink(ExternalLinks.GOOGLE_EMAIL_INBOX);
      }
    };

    let titleObs = this.tr.get(
      'registerPage.registerForm.success.successRegisterText'
    );
    let mailSentObs = this.tr.get(
      'registerPage.registerForm.success.emailSentMessage'
    );
    let openMailObs = this.tr.get(
      'registerPage.registerForm.success.openMailApp'
    );
    let merged = zip(titleObs, mailSentObs, openMailObs);
    merged.subscribe({
      next: (results) => {
        let [title, mailSent, openMail] = results;
        Swal.fire({
          title: '',
          html: `${mailSent.replace(
            '{{}}',
            '<strong>yo****l@swa.com</strong>'
          )}`,
          icon: 'success',
          confirmButtonText: openMail,
          confirmButtonColor: this.appConfig.getCssVariable('--sys-primary'),
          heightAuto: false,
        }).then((c) => {
          if (c.dismiss) {
            swalIsDismissed();
          } else if (c.isConfirmed) {
            swalIsConfirmed();
          }
        });
      },
    });
  }
  private requestRegisterParent(body: FRegisterParent) {
    this.appConfig.startLoading().then((loading) => {
      this.apiService
        .registerParent(body)
        .pipe(
          this.unsubscribe.takeUntilDestroy,
          finalize(() => loading.dismiss())
        )
        .subscribe({
          next: (results: any) => {
            let keys = Object.keys(results[0]);
            if (
              keys.includes('Status') &&
              results[0]['Status'].toLocaleLowerCase() ===
                'Successfully registered'.toLocaleLowerCase()
            ) {
              this.registrationSuccessHandler();
            } else if (keys.includes('Status')) {
              let title = 'defaults.failed';
              this.appConfig.openAlertMessageBox(title, results[0]['Status']);
            } else {
              throw Error('Unexpected response parsed.');
            }
          },
          error: (err) => {
            let title = 'defaults.failed';
            let message = 'defaults.errors.somethingWentWrongTryAgain';
            this.appConfig.openAlertMessageBox(title, message);
          },
        });
    });
  }
  submitForm() {
    const submission = () => {
      const parentDetails =
        this.registerParentAccountInfoService.getRegisterParentMap();
      const studentDetails = this.studentDetailsService.getStudentDetailsMap();
      parentDetails.set(
        'SDetails',
        (studentDetails as any[]).map((p) => Object.fromEntries(p))
      );
      this.requestRegisterParent(
        Object.fromEntries(parentDetails) as FRegisterParent
      );
    };

    if (
      this.registerParentAccountInfoService.parentForm.valid &&
      this.studentDetailsService.studentForm.valid
    ) {
      submission();
    } else {
      this.validateRegistrationForm();
      this.registerParentAccountInfoService.parentForm.markAllAsTouched();
      this.studentDetailsService.studentForm.markAllAsTouched();
    }
  }
}
