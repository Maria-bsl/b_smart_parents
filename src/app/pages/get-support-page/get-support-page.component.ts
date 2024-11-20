import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  IonContent,
  IonText,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { UsersManagementService } from 'src/app/services/users-management/users-management.service';
import { Subject } from 'rxjs';
import { GetParentDetail } from 'src/app/core/interfaces/GetParentDetails';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-get-support-page',
  templateUrl: './get-support-page.component.html',
  styleUrls: ['./get-support-page.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonText,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    TranslateModule,
    MatToolbarModule,
    CommonModule,
  ],
})
export class GetSupportPageComponent implements OnInit {
  parentDetail$ = new Subject<GetParentDetail | null>();
  constructor(private usersService: UsersManagementService) {}
  ngOnInit() {
    this.usersService.getParentDetails(
      localStorage.getItem('User_Name')!,
      this.parentDetail$
    );
  }
}
