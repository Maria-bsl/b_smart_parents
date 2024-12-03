import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRipple, MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationExtras, Router } from '@angular/router';
import {
  IonContent,
  IonTitle,
  IonBackButton,
  IonButtons,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { finalize, firstValueFrom, Observable, of, zip } from 'rxjs';
import { GetSDetails } from 'src/app/core/interfaces/GetSDetails';
import { IPackage } from 'src/app/core/interfaces/packages';
import {
  FindPackagePipe,
  SwitchPackageNameForColorPipe,
  SwitchPackageNamePipe,
} from 'src/app/core/pipes/is-empty-shelf/is-empty-shelf.pipe';
import { ApiConfigService } from 'src/app/services/api-config/api-config.service';
import { AppConfigService } from 'src/app/services/app-config/app-config.service';
import { LoadingService } from 'src/app/services/loading-service/loading.service';
import { UnsubscriberService } from 'src/app/services/unsubscriber/unsubscriber.service';

@Component({
  selector: 'app-latest-subscriptions-page',
  templateUrl: './latest-subscriptions-page.component.html',
  styleUrls: ['./latest-subscriptions-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonTitle,
    IonContent,
    TranslateModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    FindPackagePipe,
    SwitchPackageNamePipe,
    SwitchPackageNameForColorPipe,
    MatRippleModule,
    IonBackButton,
    IonButtons,
  ],
})
export class LatestSubscriptionsPageComponent implements OnInit {
  studentDetails: GetSDetails = JSON.parse(
    localStorage.getItem('GetSDetails')!
  );
  package$!: Observable<IPackage[]>;
  packageHistory$!: Observable<IPackage[]>;
  constructor(
    private appConfig: AppConfigService,
    private apiService: ApiConfigService,
    private loadingService: LoadingService,
    private unsubscribe: UnsubscriberService,
    private router: Router
  ) {
    this.appConfig.addIcons(
      ['chevron-left', 'chevron-right', 'box-arrow-right'],
      '/assets/bootstrap-icons'
    );
  }
  private requestStudentPackage() {
    let priceListReq = this.apiService.getPackagePriceList({});
    let historyListReq = this.apiService.getPackageHistoryList({
      User_Name: this.studentDetails.Students![0].User_Name,
      //User_Name: this.studentDetails.Students[0].User_Name,
    });
    let merged = zip(priceListReq, historyListReq);
    this.loadingService.startLoading().then((loading) => {
      merged
        .pipe(
          this.unsubscribe.takeUntilDestroy,
          finalize(() => this.loadingService.dismiss())
        )
        .subscribe({
          next: (results) => {
            let [priceList, historyList] = results;
            this.package$ = of(priceList);
            //historyList.splice(1);
            this.packageHistory$ = of(historyList);
          },
        });
    });
  }
  openSubscriptionPage(event: any, packageSno: number) {
    let found = firstValueFrom(this.package$);
    found.then((packages) => {
      const navigationExtras: NavigationExtras = {
        state: {
          package: packages.find((p) => p.Package_Mas_Sno === packageSno),
        },
      };
      this.router.navigateByUrl('package/subscribe', navigationExtras);
    });
  }
  ngOnInit() {
    this.requestStudentPackage();
  }
}
