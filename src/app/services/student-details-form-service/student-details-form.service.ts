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
    private apiService: ApiConfigService
  ) {
    this.requestFacultiesList();
  }
  private requestFacultiesList() {
    this.appConfig.startLoading().then((loading) => {
      this.apiService
        .getFacilities({})
        .pipe(
          this.unsubscribe.takeUntilDestroy,
          finalize(() => loading.dismiss())
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
  get SDetails() {
    return this.studentForm.get('SDetails') as FormArray;
  }
}
