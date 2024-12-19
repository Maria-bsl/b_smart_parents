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
  NavController,
} from '@ionic/angular/standalone';
import { UsersManagementService } from 'src/app/services/users-management/users-management.service';
import { Subject } from 'rxjs';
import { GetParentDetail } from 'src/app/core/interfaces/GetParentDetails';
import { CommonModule } from '@angular/common';
import { AppConfigService } from 'src/app/services/app-config/app-config.service';

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
  mobileNumber: string = '0684831846';
  constructor(
    private usersService: UsersManagementService,
    private navCtrl: NavController,
    private _appConfig: AppConfigService
  ) {
    this.backButtonHandler();
  }
  private backButtonHandler() {
    const backToHome = () => this.navCtrl.navigateRoot('/tabs/tab-1/dashboard');
    this._appConfig.backButtonEventHandler(backToHome);
  }
  ngOnInit() {
    this.usersService.getParentDetails(
      localStorage.getItem('User_Name')!,
      this.parentDetail$
    );
  }
}
