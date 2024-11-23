import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  Form,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  IonText,
  IonContent,
  IonBackButton,
  IonButtons,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { map, Observable, of, startWith, switchMap, zip } from 'rxjs';
import { RegisterParentAccountInfoComponent } from 'src/app/components/templates/register-parent-account-info/register-parent-account-info.component';
import { StudentDetailsFormComponent } from 'src/app/components/templates/student-details-form/student-details-form.component';
import { AvailableMobileNumbersRegex } from 'src/app/core/enums/available-mobile-numbers';
import { GetFacilities } from 'src/app/core/interfaces/GetFacilities';
import { HasFormControlErrorPipe } from 'src/app/core/pipes/has-form-control-error/has-form-control-error.pipe';
import { FacilitiesService } from 'src/app/services/facilities/facilities.service';
import { RegisterPageService } from 'src/app/services/pages/register-page-service/register-page.service';
import { RegisterAccountInfoService } from 'src/app/services/register-account-info-service/register-account-info.service';
import { UnsubscriberService } from 'src/app/services/unsubscriber/unsubscriber.service';
import { AppLauncher } from '@capacitor/app-launcher';
import Swal from 'sweetalert2';
import { AppConfigService } from 'src/app/services/app-config/app-config.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonText,
    IonContent,
    IonBackButton,
    IonButtons,
    MatIconModule,
    MatToolbarModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    ReactiveFormsModule,
    TranslateModule,
    RegisterParentAccountInfoComponent,
    StudentDetailsFormComponent,
  ],
})
export class RegisterPageComponent implements OnInit, AfterViewInit {
  isLinear: boolean = false;
  constructor(
    public registerPageService: RegisterPageService,
    private appConfig: AppConfigService,
    private tr: TranslateService
  ) {}
  ngAfterViewInit(): void {}
  ngOnInit() {}
  async submitRegisterForm(event: any) {
    this.registerPageService.submitForm();
  }
}
