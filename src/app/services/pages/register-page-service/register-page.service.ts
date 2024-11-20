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
  firstValueFrom,
  map,
  Observable,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { GetFacilities } from 'src/app/core/interfaces/GetFacilities';
import { UnsubscriberService } from '../../unsubscriber/unsubscriber.service';
import { AppConfigService } from '../../app-config/app-config.service';
import { RegisterAccountInfoService } from '../../register-account-info-service/register-account-info.service';
import { StudentDetailsFormService } from '../../student-details-form-service/student-details-form.service';

@Injectable({
  providedIn: 'root',
})
export class RegisterPageService {
  constructor(
    public registerParentAccountInfoService: RegisterAccountInfoService,
    public studentDetailsService: StudentDetailsFormService,
    private appConfig: AppConfigService
  ) {}
  validateRegistrationForm() {
    let errors = { title: 'defaults.errors.invalidForm', message: '' };
    this.registerParentAccountInfoService.validateForm(errors);
    this.studentDetailsService.validateForm(errors);
    errors.message
      ? this.appConfig.openAlertMessageBox(errors.title, errors.message)
      : (() => {})();
  }
}
