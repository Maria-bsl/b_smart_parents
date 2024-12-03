import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { NgxSonnerToaster } from 'ngx-sonner';
import { AppConfigService } from './services/app-config/app-config.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, RouterOutlet, NgxSonnerToaster],
})
export class AppComponent {
  constructor(private appConfig: AppConfigService) {
    this.appConfig.initTranslations();
  }
}
