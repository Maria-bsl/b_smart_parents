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
  NavController,
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
import { StudentDetailsFormComponent } from 'src/app/components/templates/student-details-form/student-details-form.component';
import { StudentDetailsFormService } from 'src/app/services/student-details-form-service/student-details-form.service';
import { FRegisterParent } from 'src/app/core/forms/f-add-student';
import { ApiConfigService } from 'src/app/services/api-config/api-config.service';
import { MatDividerModule } from '@angular/material/divider';

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
    StudentDetailsFormComponent,
  ],
})
export class AddStudentPageComponent implements OnInit {
  constructor(
    private _appConfig: AppConfigService,
    public studentDetailsFormService: StudentDetailsFormService,
    private navCtrl: NavController
  ) {
    const backToHome = () => this.navCtrl.navigateRoot('/home');
    this._appConfig.backButtonEventHandler(backToHome);
  }
  ngOnInit(): void {
    this.studentDetailsFormService.requestFacultiesList();
  }
  submitStudentForm(event: any) {
    this.studentDetailsFormService.submitForm();
  }
  resetForm(event: any) {
    this.studentDetailsFormService.studentForm.reset();
  }
}
