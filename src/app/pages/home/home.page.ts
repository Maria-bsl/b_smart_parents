import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonText,
  IonIcon,
  IonButton,
  IonBackButton,
  IonButtons,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule } from '@angular/material/core';
import {
  GetSDetails,
  GetSDetailStudents,
} from 'src/app/core/interfaces/GetSDetails';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer } from '@angular/platform-browser';
import { UsersManagementService } from 'src/app/services/users-management/users-management.service';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppConfigService } from 'src/app/services/app-config/app-config.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonBackButton,
    IonButton,
    CommonModule,
    IonContent,
    TranslateModule,
    IonText,
    MatCardModule,
    MatListModule,
    MatRippleModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
  ],
})
export class HomePage implements OnInit {
  studentDetails: GetSDetails = JSON.parse(
    localStorage.getItem('GetSDetails')!
  );
  constructor(
    private appConfig: AppConfigService,
    private iconRegistry: MatIconRegistry,
    private sanatizer: DomSanitizer,
    private usersService: UsersManagementService,
    private router: Router
  ) {
    this.registerIcons();
  }
  private registerIcons() {
    let icons = ['log-out', 'plus'];
    icons.forEach((icon) => {
      this.iconRegistry.addSvgIcon(
        icon,
        this.sanatizer.bypassSecurityTrustResourceUrl(
          `/assets/feather/${icon}.svg`
        )
      );
    });
  }
  ngOnInit(): void {
    localStorage.removeItem('selectedStudent');
  }
  openAddStudentPage() {
    this.router.navigate(['/add-student']);
  }
  openNavigationsPages(event: any, student: GetSDetailStudents) {
    this.appConfig.startLoading().then((loading) => {
      setTimeout(() => {
        loading.dismiss();
        localStorage.setItem('selectedStudent', JSON.stringify(student));
        this.router.navigate(['/tabs/tab-1/dashboard']);
      }, 2000);
    });
  }
  logOutClicked(event: any) {
    this.usersService.logOutUser();
  }
}
