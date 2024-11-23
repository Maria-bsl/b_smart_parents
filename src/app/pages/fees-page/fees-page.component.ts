import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {
  MatTabContent,
  MatTabGroup,
  MatTabHeader,
  MatTabLabel,
  MatTabLink,
  MatTabNav,
  MatTabsModule,
} from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  IonContent,
  IonButtons,
  IonBackButton,
  IonText,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { map } from 'rxjs';
import { AppUtilities } from 'src/app/core/utils/AppUtilities';
import { AppConfigService } from 'src/app/services/app-config/app-config.service';
import { FeesPageService } from 'src/app/services/pages/fees-page-service/fees-page.service';

@Component({
  selector: 'app-fees-page',
  templateUrl: './fees-page.component.html',
  styleUrls: ['./fees-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButtons,
    IonBackButton,
    IonText,
    TranslateModule,
    MatToolbarModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
  ],
})
export class FeesPageComponent implements OnInit, AfterViewInit {
  studentInvoices$ = this.feesService.studentInvoices$.asObservable().pipe(
    map((invoices) =>
      invoices.map((invoice) => {
        return {
          ...invoice,
          Expired_Date: AppUtilities.convertToDate(
            invoice.Invoice_Date as string
          ),
        };
      })
    )
  );
  studentPendingInvoices$ = this.feesService.studentPendingInvoices$
    .asObservable()
    .pipe(
      map((invoices) =>
        invoices.map((invoice) => {
          return {
            ...invoice,
            Expired_Date: AppUtilities.convertToDate(
              invoice.Expired_Date as string
            ),
          };
        })
      )
    );
  studentPaidInvoice$ = this.feesService.studentPaidInvoice$
    .asObservable()
    .pipe(
      map((invoices) =>
        invoices.map((invoice) => {
          return {
            ...invoice,
            Expired_Date: AppUtilities.convertToDate(
              invoice.Paid_Date as string
            ),
          };
        })
      )
    );

  constructor(
    public feesService: FeesPageService,
    private appConfig: AppConfigService
  ) {
    let icons = ['arrow-right', 'download'];
    this.appConfig.addIcons(icons, '/assets/bootstrap-icons');
  }
  ngAfterViewInit(): void {}
  ngOnInit() {
    this.feesService.initFeesPage();
  }
}
