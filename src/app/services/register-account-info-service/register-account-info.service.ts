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
  //returns form details as map if form is valid
  getRegisterParentMap() {
    const details = new Map<string, any>();
    let errors = { title: '', message: '' };
    this.validateForm(errors);
    if (errors.message) {
      return details;
    }
    details.set('User_Name', this.User_Name.value);
    details.set('Email_Address', this.Email_Address.value);
    details.set('Parent_Name', this.Parent_Name.value);
    details.set('Mobile_No', '0' + this.Mobile_No.value);
    return details;
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
