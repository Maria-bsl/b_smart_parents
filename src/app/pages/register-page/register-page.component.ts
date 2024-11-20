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
import { TranslateModule } from '@ngx-translate/core';
import { map, Observable, of, startWith, switchMap } from 'rxjs';
import { RegisterParentAccountInfoComponent } from 'src/app/components/templates/register-parent-account-info/register-parent-account-info.component';
import { StudentDetailsFormComponent } from 'src/app/components/templates/student-details-form/student-details-form.component';
import { AvailableMobileNumbersRegex } from 'src/app/core/enums/available-mobile-numbers';
import { GetFacilities } from 'src/app/core/interfaces/GetFacilities';
import { HasFormControlErrorPipe } from 'src/app/core/pipes/has-form-control-error/has-form-control-error.pipe';
import { FacilitiesService } from 'src/app/services/facilities/facilities.service';
import { RegisterPageService } from 'src/app/services/pages/register-page-service/register-page.service';
import { RegisterAccountInfoService } from 'src/app/services/register-account-info-service/register-account-info.service';
import { UnsubscriberService } from 'src/app/services/unsubscriber/unsubscriber.service';

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
  constructor(public registerPageService: RegisterPageService) {}
  ngAfterViewInit(): void {}
  ngOnInit() {}
  // submitAddStudentForm(event: any) {
  //   if (this.studentForm.valid) {
  //     let sDetail = this.SDetails.controls.at(0) as FormGroup;
  //     // this.filteredOptions$
  //     //   .pipe(this._unsubscriber.takeUntilDestroy)
  //     //   .subscribe({
  //     //     next: (faculties) => {
  //     //       let facilityName = sDetail?.get('SearchFacility')?.value;
  //     //       let found = faculties.find((e) => e.Facility_Name === facilityName);
  //     //       let admissionNo = sDetail?.get('Admission_No')?.value;
  //     //       if (found) {
  //     //         let studentForm = new Map();
  //     //         studentForm.set('Admission_No', `${admissionNo}`);
  //     //         studentForm.set('Facility_Reg_Sno', `${found.Facility_Reg_Sno}`);
  //     //         let form = new Map();
  //     //         form.set('User_Name', localStorage.getItem('User_Name')!);
  //     //         form.set('SDetails', Object.fromEntries(studentForm));
  //     //         console.log(Object.fromEntries(form));
  //     //         //this.facultiesService.addStudent(Object.fromEntries(form));
  //     //       }
  //     //     },
  //     //   });
  //   } else {
  //     this.studentForm.markAllAsTouched();
  //   }
  // }
  submitRegisterForm(event: any) {
    if (
      this.registerPageService.registerParentAccountInfoService.parentForm
        .valid &&
      this.registerPageService.studentDetailsService.studentForm.valid
    ) {
    } else {
      this.registerPageService.validateRegistrationForm();
      this.registerPageService.registerParentAccountInfoService.parentForm.markAllAsTouched();
      this.registerPageService.studentDetailsService.studentForm.markAllAsTouched();
    }
  }
}
