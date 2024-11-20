import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  IonContent,
  IonText,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { GetParentDetail } from 'src/app/core/interfaces/GetParentDetails';
import { UsersManagementService } from 'src/app/services/users-management/users-management.service';

@Component({
  selector: 'app-change-password-page',
  templateUrl: './change-password-page.component.html',
  styleUrls: ['./change-password-page.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonText,
    IonContent,
    MatToolbarModule,
    IonButtons,
    IonBackButton,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    IonButton,
    ReactiveFormsModule,
  ],
})
export class ChangePasswordPageComponent implements OnInit {
  parentDetail = new Subject<GetParentDetail>();
  changePasswordForm: FormGroup = this.fb.group({
    currentPassword: this.fb.control('', [Validators.required]),
    newPassword: this.fb.control('', [
      Validators.required,
      this.usersService.matchValidator('confirmPassword', true),
    ]),
    confirmPassword: this.fb.control('', [
      Validators.required,
      this.usersService.matchValidator('newPassword'),
    ]),
  });
  constructor(
    private fb: FormBuilder,
    private usersService: UsersManagementService
  ) {}
  ngOnInit() {}
  submitChangePasswordForm() {
    if (this.changePasswordForm.valid) {
      this.usersService.changePassword(this.confirmPassword.value);
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }
  get currentPassword() {
    return this.changePasswordForm.get('currentPassword') as FormControl;
  }
  get newPassword() {
    return this.changePasswordForm.get('newPassword') as FormControl;
  }
  get confirmPassword() {
    return this.changePasswordForm.get('confirmPassword') as FormControl;
  }
}
