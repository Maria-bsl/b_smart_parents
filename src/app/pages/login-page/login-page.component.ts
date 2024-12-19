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
import { Router, RouterLink } from '@angular/router';
import * as crypto from 'crypto';
import { MatDialog } from '@angular/material/dialog';
import { PayWithMpesaComponent } from 'src/app/components/dialogs/pay-with-mpesa/pay-with-mpesa.component';
import { HttpClient } from '@angular/common/http';

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
    MatButtonModule,
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
    private usersService: UsersManagementService,
    private router: Router,
    private _dialog: MatDialog //private http: HttpClient
  ) {
    addIcons({ arrowForwardOutline });
  }
  ngOnInit() {}
  submitLoginForm() {
    // fetch('https://jsonplaceholder.typicode.com/todos/1')
    //   .then((response) => response.json())
    //   .then((json) => console.log(json));
    // this.http
    //   .get('https://jsonplaceholder.typicode.com/todos/1')
    //   .subscribe((val) => console.log(val));

    if (this.loginFormGroup.valid) {
      this.usersService.loginUser(this.loginFormGroup.value);
      //this.usersService.requestToken(this.loginFormGroup.value);
    } else {
      this.loginFormGroup.markAllAsTouched();
    }
  }
  onRegisterClicked(event: MouseEvent) {
    this.router.navigate(['/register'], { replaceUrl: true });
    // const dialog = this._dialog.open(PayWithMpesaComponent, {
    //   width: '400px',
    //   data: {
    //     amount: 10000,
    //     description: 'TEST',
    //   },
    //   panelClass: 'm-pesa-panel',
    //   disableClose: true,
    // });
    // dialog.componentInstance.mpesaService.transactionCompleted
    //   .asObservable()
    //   .subscribe({
    //     next: async (isSuccess) => {
    //       if (isSuccess) {
    //         dialog.close();
    //       }
    //     },
    //   });
  }
  get User_Name() {
    return this.loginFormGroup.get('User_Name') as FormControl;
  }
  get Password() {
    return this.loginFormGroup.get('Password') as FormControl;
  }
}
