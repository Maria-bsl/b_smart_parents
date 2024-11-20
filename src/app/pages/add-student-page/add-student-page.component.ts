import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatStepperModule } from '@angular/material/stepper';
import {
  IonContent,
  IonText,
  IonToolbar,
  IonBackButton,
  IonHeader,
  IonButtons,
  IonTitle,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { AppConfigService } from 'src/app/services/app-config/app-config.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { GetFacilities } from 'src/app/core/interfaces/GetFacilities';
import {
  BehaviorSubject,
  filter,
  map,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { UsersManagementService } from 'src/app/services/users-management/users-management.service';
import { UnsubscriberService } from 'src/app/services/unsubscriber/unsubscriber.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FacilitiesService } from 'src/app/services/facilities/facilities.service';

@Component({
  selector: 'app-add-student-page',
  templateUrl: './add-student-page.component.html',
  styleUrls: ['./add-student-page.component.scss'],
  standalone: true,
  imports: [
    IonText,
    IonContent,
    TranslateModule,
    IonBackButton,
    IonButtons,
    MatToolbarModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatAutocompleteModule,
  ],
})
export class AddStudentPageComponent implements OnInit {
  //facultiesOptions$!: Observable<GetFacilities[]>;
  //faculties$ = new Subject<GetFacilities[]>();
  faculties$: Observable<GetFacilities[] | null> =
    this.facultiesService.faculties$.asObservable();
  filteredOptions$: Observable<GetFacilities[]> = of();
  isLinear: boolean = true;
  studentForm: FormGroup = this.fb.group({
    SDetails: this.fb.array(
      [
        this.fb.group({
          Admission_No: this.fb.control('', [Validators.required]),
          Facility_Reg_Sno: this.fb.control('', []),
          SearchFacility: this.fb.control('', [Validators.required]),
        }),
      ],
      []
    ),
  });
  constructor(
    private appConfig: AppConfigService,
    private facultiesService: FacilitiesService,
    private fb: FormBuilder,
    private _unsubscriber: UnsubscriberService
  ) {}
  private facultyChangedEventHandler() {
    let facilityControl = (this.SDetails.controls.at(0) as FormGroup).get(
      'SearchFacility'
    )! as FormControl;
    this.filteredOptions$ = facilityControl.valueChanges.pipe(
      startWith(''),
      switchMap((value) => this._filter(value || ''))
    );
  }
  private _filter(value: string) {
    const filterValue = value.toLocaleLowerCase();
    return this.faculties$.pipe(
      map((arr) =>
        arr!.filter((val) =>
          val.Facility_Name.toLocaleLowerCase().includes(filterValue)
        )
      )
    );
  }
  ngOnInit() {
    this.facultiesService.getFacultiesList();
    this.faculties$.pipe(this._unsubscriber.takeUntilDestroy).subscribe({
      next: (faculties) => {
        if (faculties) {
          this.faculties$ = of(faculties);
          this.facultyChangedEventHandler();
        }
      },
    });
  }
  goBack() {
    this.appConfig.navigateBack();
  }
  resetForm() {
    this.studentForm.reset();
  }
  submitAddStudentForm() {
    if (this.studentForm.valid) {
      let sDetail = this.SDetails.controls.at(0) as FormGroup;
      this.filteredOptions$
        .pipe(this._unsubscriber.takeUntilDestroy)
        .subscribe({
          next: (faculties) => {
            let facilityName = sDetail?.get('SearchFacility')?.value;
            let found = faculties.find(
              (e) =>
                e.Facility_Name.toLocaleLowerCase() ===
                facilityName.toLocaleLowerCase()
            );
            let admissionNo = sDetail?.get('Admission_No')?.value;
            if (found) {
              let studentForm = new Map();
              studentForm.set('Admission_No', `${admissionNo}`);
              studentForm.set('Facility_Reg_Sno', `${found.Facility_Reg_Sno}`);
              let form = new Map();
              form.set('User_Name', localStorage.getItem('User_Name')!);
              form.set('SDetails', Object.fromEntries(studentForm));
              this.facultiesService.addStudent(Object.fromEntries(form));
            }
          },
        });
    } else {
      this.studentForm.markAllAsTouched();
    }
  }
  get SDetails() {
    return this.studentForm.get('SDetails') as FormArray;
  }
}
