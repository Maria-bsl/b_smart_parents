import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  IonContent,
  IonText,
  IonButton,
  IonIcon,
  LoadingController,
  IonButtons,
  IonBackButton,
} from '@ionic/angular/standalone';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { arrowForwardOutline } from 'ionicons/icons';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiConfigService } from 'src/app/services/api-config/api-config.service';
import { UnsubscriberService } from 'src/app/services/unsubscriber/unsubscriber.service';
import { AppConfigService } from 'src/app/services/app-config/app-config.service';
import { UsersManagementService } from 'src/app/services/users-management/users-management.service';
import { RouterLink } from '@angular/router';
import * as crypto from 'crypto';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  standalone: true,
  imports: [
    IonBackButton,
    IonButtons,
    IonIcon,
    CommonModule,
    TranslateModule,
    IonText,
    IonContent,
    IonButton,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    RouterLink,
  ],
})
export class LoginPageComponent implements OnInit {
  loginFormGroup: FormGroup = this.fb.group({
    User_Name: this.fb.control<string>('', [
      Validators.required,
      //Validators.email,
    ]),
    Password: this.fb.control<string>('', [Validators.required]),
  });
  constructor(
    private fb: FormBuilder,
    private usersService: UsersManagementService
  ) {
    addIcons({ arrowForwardOutline });
  }
  ngOnInit() {}
  submitLoginForm() {
    if (this.loginFormGroup.valid) {
      this.usersService.loginUser(this.loginFormGroup.value);
      //this.usersService.requestToken(this.loginFormGroup.value);
    } else {
      this.loginFormGroup.markAllAsTouched();
    }
  }
  get User_Name() {
    return this.loginFormGroup.get('User_Name') as FormControl;
  }
  get Password() {
    return this.loginFormGroup.get('Password') as FormControl;
  }
}
