import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AvailableMobileNumbersRegex } from 'src/app/core/enums/available-mobile-numbers';

@Injectable({
  providedIn: 'root',
})
export class RegisterAccountInfoService {
  parentForm: FormGroup = this.fb.group({
    User_Name: this.fb.control<string>('', [Validators.required]),
    Email_Address: this.fb.control<string>('', [
      Validators.required,
      Validators.email,
    ]),
    Parent_Name: this.fb.control<string>('', [Validators.required]),
    Mobile_No: this.fb.control<string>('', [
      Validators.required,
      Validators.pattern(
        AvailableMobileNumbersRegex.TANZANIA_MOBILE_NUMBER_REGEX
      ),
    ]),
  });
  constructor(private fb: FormBuilder) {}
  validateForm(errors: { title: string; message: string }) {
    //let title = 'defaults.errors.invalidForm';
    if (this.Parent_Name.invalid) {
      errors.message = 'registerPage.registerForm.errors.missingParentName';
    } else if (this.Mobile_No.invalid) {
      errors.message = this.Mobile_No.hasError('pattern')
        ? 'registerPage.registerForm.errors.mobileNumberIsInvalid'
        : 'registerPage.registerForm.errors.missingPhoneNumber';
    } else if (this.User_Name.invalid) {
      errors.message = 'registerPage.registerForm.errors.missingUsername';
    } else if (this.Email_Address.invalid) {
      errors.message = this.Email_Address.hasError('email')
        ? 'registerPage.registerForm.errors.invalidEmail'
        : 'registerPage.registerForm.errors.missingEmailAddress';
    } else {
    }
  }
  get User_Name() {
    return this.parentForm.get('User_Name') as FormControl;
  }
  get Email_Address() {
    return this.parentForm.get('Email_Address') as FormControl;
  }
  get Parent_Name() {
    return this.parentForm.get('Parent_Name') as FormControl;
  }
  get Mobile_No() {
    return this.parentForm.get('Mobile_No') as FormControl;
  }
}
