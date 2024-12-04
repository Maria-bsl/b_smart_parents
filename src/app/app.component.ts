import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { NgxSonnerToaster } from 'ngx-sonner';
import { AppConfigService } from './services/app-config/app-config.service';
import { RouterOutlet } from '@angular/router';
import { ApiConfigService } from './services/api-config/api-config.service';
import { UsersManagementService } from './services/users-management/users-management.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, RouterOutlet, NgxSonnerToaster],
})
export class AppComponent {
  constructor(
    private appConfig: AppConfigService,
    private usersService: UsersManagementService
  ) {
    this.appConfig.initTranslations();
    //this.usersService.initToken();
  }
}
