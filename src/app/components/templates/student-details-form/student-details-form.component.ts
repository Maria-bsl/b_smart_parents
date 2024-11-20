import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IonText } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { HasFormControlErrorPipe } from 'src/app/core/pipes/has-form-control-error/has-form-control-error.pipe';
import { StudentDetailsFormService } from 'src/app/services/student-details-form-service/student-details-form.service';

@Component({
  selector: 'app-student-details-form',
  templateUrl: './student-details-form.component.html',
  styleUrls: ['./student-details-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    MatAutocompleteModule,
    HasFormControlErrorPipe,
    MatButtonModule,
    IonText,
  ],
})
export class StudentDetailsFormComponent implements OnInit {
  @Input() studentDetailsService!: StudentDetailsFormService;
  constructor() {}

  ngOnInit() {}
}
