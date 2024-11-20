import { Component, Inject, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { IonText } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { HasFormControlErrorPipe } from 'src/app/core/pipes/has-form-control-error/has-form-control-error.pipe';
import { RegisterPageService } from 'src/app/services/pages/register-page-service/register-page.service';
import { RegisterAccountInfoService } from 'src/app/services/register-account-info-service/register-account-info.service';

@Component({
  selector: 'app-register-parent-account-info',
  templateUrl: './register-parent-account-info.component.html',
  styleUrls: ['./register-parent-account-info.component.scss'],
  standalone: true,
  imports: [
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    IonText,
    HasFormControlErrorPipe,
    TranslateModule,
  ],
})
export class RegisterParentAccountInfoComponent implements OnInit {
  @Input() accountInfoService!: RegisterAccountInfoService;
  constructor() {}
  ngOnInit() {
    if (!this.accountInfoService)
      throw Error('Service not found for Account info.');
  }
}
