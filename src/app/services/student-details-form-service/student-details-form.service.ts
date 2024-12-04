import { Injectable, Input } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { finalize, map, Observable, of, startWith, switchMap } from 'rxjs';
import { GetFacilities } from 'src/app/core/interfaces/GetFacilities';
import { AppConfigService } from '../app-config/app-config.service';
import { ApiConfigService } from '../api-config/api-config.service';
import { UnsubscriberService } from '../unsubscriber/unsubscriber.service';
import { FRegisterParent } from 'src/app/core/forms/f-add-student';
import { toast } from 'ngx-sonner';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LoadingService } from '../loading-service/loading.service';
import { NavController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class StudentDetailsFormService {
  private faculties: GetFacilities[] = [];
  filteredFacultiesOptions$: Observable<GetFacilities[]> = of();
  studentForm: FormGroup = this.fb.group({
    SDetails: this.fb.array(
      [
        this.fb.group({
          Admission_No: this.fb.control<string>('', [Validators.required]),
          Facility_Reg_Sno: this.fb.control<string>('', []),
          SearchFacility: this.fb.control<string>('', {
            validators: [Validators.required, this.isInvalidFacultyName()],
          }),
        }),
      ],
      []
    ),
  });
  constructor(
    private fb: FormBuilder,
    private unsubscribe: UnsubscriberService,
    private appConfig: AppConfigService,
    private apiService: ApiConfigService,
    private tr: TranslateService,
    private loadingService: LoadingService,
    private navCtrl: NavController
  ) {
    this.requestFacultiesList();
  }
  private requestFacultiesList() {
    this.loadingService.startLoading().then((loading) => {
      this.apiService
        .getFacilities({})
        .pipe(
          this.unsubscribe.takeUntilDestroy,
          finalize(() => this.loadingService.dismiss())
        )
        .subscribe({
          next: (res: any) => {
            this.faculties = res;
            this.setupFacultiesAutocompleteEventHandlers();
          },
          error: (err) => {
            let failedMessageObs = 'defaults.failed';
            let errorOccuredMessageObs =
              'addStudentPage.errors.failedToFindFaculties';
            this.appConfig.openAlertMessageBox(
              failedMessageObs,
              errorOccuredMessageObs
            );
          },
        });
    });
  }
  private isInvalidFacultyName(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      let found = this.faculties.find(
        (faculty) =>
          faculty.Facility_Name.toLocaleLowerCase() ===
          control.value.toLocaleLowerCase()
      );
      return found ? null : { invalidFacultyName: true };
    };
  }
  private requestAddStudent(body: FRegisterParent) {
    this.loadingService.startLoading().then((loading) => {
      this.apiService
        .addStudent(body)
        .pipe(
          this.unsubscribe.takeUntilDestroy,
          finalize(() => this.loadingService.dismiss())
        )
        .subscribe({
          next: (results: any) => {
            let keys = Object.keys(results[0]);
            if (
              keys.includes('Status') &&
              results[0]['Status'].toLocaleLowerCase() ===
                'Successfully added'.toLocaleLowerCase()
            ) {
              let tr = this.tr.get('addStudentPage.success.successAddStudent');
              tr.pipe(this.unsubscribe.takeUntilDestroy).subscribe({
                next: (msg) => {
                  toast.success(msg);
                  this.studentForm.reset();
                  this.navCtrl.navigateBack('/home');
                  //this.router.navigate(['/home']);
                },
              });
            } else if (keys.includes('Status')) {
              let failedMessageObs = 'defaults.failed';
              let errorMessage = results[0].Status;
              this.appConfig.openAlertMessageBox(
                failedMessageObs,
                errorMessage
              );
            } else {
              throw Error('Unexpected response parsed.');
            }
            this.loadingService.dismiss();
          },
        });
    });
  }
  private setupFacultiesAutocompleteEventHandlers() {
    const filterFaculty = (facultyName: string) => {
      return this.faculties.filter((faculty) =>
        faculty.Facility_Name.toLocaleLowerCase().includes(
          facultyName.toLocaleLowerCase()
        )
      );
    };
    try {
      const searchFacultyControl = this.SDetails?.at(0)?.get(
        'SearchFacility'
      ) as FormControl;
      this.filteredFacultiesOptions$ = searchFacultyControl.valueChanges.pipe(
        startWith(''),
        map((value) => filterFaculty(value || ''))
      );
    } catch (error) {
      console.error(error);
    }
  }
  validateForm(errors: { title: string; message: string }) {
    this.SDetails.controls.forEach((control, index) => {
      const search = control.get('SearchFacility');
      if (
        search?.hasError('invalidFacultyName') ||
        search?.hasError('required')
      ) {
        errors.message = search?.hasError('invalidFacultyName')
          ? 'registerPage.registerForm.errors.invalidSchoolName'
          : 'registerPage.registerForm.errors.missingSchoolName';
      }
      const admissionNo = control.get('Admission_No');
      if (admissionNo?.hasError('required')) {
        errors.message = errors.message
          ? errors.message
          : 'registerPage.registerForm.errors.missingAdmissionNumber';
      }
    });
  }
  //returns student details map only if form group is valid
  getStudentDetailsMap() {
    const details: Map<string, string>[] = [];
    const controls = this.SDetails.controls;
    for (const detail of controls) {
      if (detail.invalid) {
        return new Map();
      }
      let facilityName = detail?.get('SearchFacility')?.value;
      let found = this.faculties.find(
        (e) =>
          e.Facility_Name.toLocaleLowerCase() ===
          facilityName.toLocaleLowerCase()
      );
      if (found) {
        let studentForm = new Map();
        studentForm.set('Facility_Reg_Sno', `${found.Facility_Reg_Sno}`);
        studentForm.set(
          'Admission_No',
          `${detail?.get('Admission_No')?.value}`
        );
        details.push(studentForm);
      } else {
        return new Map();
      }
    }
    return details;
  }
  submitForm() {
    const validateStudentDetailsForm = () => {
      let errors = { title: 'defaults.errors.invalidForm', message: '' };
      this.validateForm(errors);
      errors.message
        ? this.appConfig.openAlertMessageBox(errors.title, errors.message)
        : (() => {})();
    };
    const submission = () => {
      let studentDetails = this.getStudentDetailsMap();
      let addStudentForm = new Map();
      addStudentForm.set('User_Name', localStorage.getItem('User_Name')!);
      addStudentForm.set(
        'SDetails',
        (studentDetails as any[]).map((p) => Object.fromEntries(p))
      );
      this.requestAddStudent(
        Object.fromEntries(addStudentForm) as FRegisterParent
      );
    };

    if (this.studentForm.valid) {
      submission();
    } else {
      validateStudentDetailsForm();
      this.studentForm.markAllAsTouched();
    }
  }
  get SDetails() {
    return this.studentForm.get('SDetails') as FormArray;
  }
}
