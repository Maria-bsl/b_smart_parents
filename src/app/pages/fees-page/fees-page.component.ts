import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import jsPDF from 'jspdf';
import { firstValueFrom, from, map, switchMap, tap } from 'rxjs';
import { PayWithMpesaComponent } from 'src/app/components/dialogs/pay-with-mpesa/pay-with-mpesa.component';
import { InvoiceReceiptComponent } from 'src/app/components/templates/invoice-receipt/invoice-receipt.component';
import { AppUtilities } from 'src/app/core/utils/AppUtilities';
import { AppConfigService } from 'src/app/services/app-config/app-config.service';
import { JspdfUtilsService } from 'src/app/services/jsdpdf-utils/jspdf-utils.service';
import { LoadingService } from 'src/app/services/loading-service/loading.service';
import { FeesPageService } from 'src/app/services/pages/fees-page-service/fees-page.service';
import { PayWithMpesaService } from 'src/app/services/pay-with-mpesa/pay-with-mpesa.service';
import { UnsubscriberService } from 'src/app/services/unsubscriber/unsubscriber.service';

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
    InvoiceReceiptComponent,
  ],
  providers: [DatePipe, CurrencyPipe],
})
export class FeesPageComponent implements OnInit, AfterViewInit {
  studentInvoices$ = this.feesService.studentInvoices$.asObservable().pipe(
    map((invoices) =>
      invoices.map((invoice) => {
        return {
          ...invoice,
          Invoice_Date: AppUtilities.convertToDate(
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
  @ViewChildren(MatCard, { read: ElementRef }) matCards!: QueryList<ElementRef>;
  constructor(
    public feesService: FeesPageService,
    private appConfig: AppConfigService,
    private jsPdfService: JspdfUtilsService,
    private loadingService: LoadingService,
    private tr: TranslateService,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    private _dialog: MatDialog,
    private _unsubscribe: UnsubscriberService
  ) {
    let icons = ['arrow-right', 'download'];
    this.appConfig.addIcons(icons, '/assets/bootstrap-icons');
    this.feesService.initFeesPage();
  }
  ngAfterViewInit(): void {}
  ngOnInit() {}
  openPayFees(invoice: any) {
    const dialog = this._dialog.open(PayWithMpesaComponent, {
      width: '400px',
      data: {
        amount: invoice.Pending_Amount,
        description: invoice.Fee_Type,
      },
      panelClass: 'm-pesa-panel',
      disableClose: true,
    });
    dialog.componentInstance.mpesaService.transactionCompleted
      .asObservable()
      .pipe(this._unsubscribe.takeUntilDestroy)
      .subscribe({
        next: async (isSuccess) => {
          if (isSuccess) {
            dialog.close();
          }
        },
      });
  }
}
