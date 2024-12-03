import { CommonModule, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import {
  defer,
  distinctUntilChanged,
  filter,
  fromEvent,
  mapTo,
  merge,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { GetSDetailStudents } from 'src/app/core/interfaces/GetSDetails';
import {
  StudentInvoice,
  StudentPaidInvoice,
  StudentPendingInvoice,
} from 'src/app/core/types/student-invoices';
import { AppConfigService } from 'src/app/services/app-config/app-config.service';
import { JspdfUtilsService } from 'src/app/services/jsdpdf-utils/jspdf-utils.service';
import { LoadingService } from 'src/app/services/loading-service/loading.service';
import { PayWithMpesaComponent } from '../../dialogs/pay-with-mpesa/pay-with-mpesa.component';
import { MatDialog } from '@angular/material/dialog';
import { UnsubscriberService } from 'src/app/services/unsubscriber/unsubscriber.service';

@Component({
  selector: 'app-invoice-receipt',
  templateUrl: './invoice-receipt.component.html',
  styleUrls: ['./invoice-receipt.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    MatCardModule,
    MatDividerModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class InvoiceReceiptComponent implements OnInit, AfterViewInit {
  selectedStudent: GetSDetailStudents = JSON.parse(
    localStorage.getItem('selectedStudent')!
  );
  @Input() invoice!:
    | StudentInvoice
    | StudentPendingInvoice
    | StudentPaidInvoice
    | any;
  @Input() canDownload: boolean = true;
  @ViewChild('invoiceReceipt') invoiceReceipt!: ElementRef<HTMLDivElement>;
  constructor(
    private loadingService: LoadingService,
    private jsPdfService: JspdfUtilsService,
    private appConfig: AppConfigService,
    private _dialog: MatDialog,
    private _unsubscribe: UnsubscriberService
  ) {
    let icons = ['arrow-right', 'download'];
    this.appConfig.addIcons(icons, '/assets/bootstrap-icons');
  }

  ngOnInit() {}
  ngAfterViewInit(): void {}
  downloadInvoiceFee(event: MouseEvent) {
    this.loadingService.startLoading().then((loading) => {
      let actions =
        this.invoiceReceipt.nativeElement.getElementsByTagName('section');
      actions[0].classList.remove('block');
      actions[0].classList.add('hidden');
      this.jsPdfService.exportHtml(this.invoiceReceipt.nativeElement);
      actions[0].classList.remove('hidden');
      actions[0].classList.add('block');
      this.loadingService.dismiss();
    });
  }
  openPayFees(event: MouseEvent) {
    const dialog = this._dialog.open(PayWithMpesaComponent, {
      width: '400px',
      data: {
        amount: this.invoice.Pending_Amount,
        description: this.invoice.Fee_Type,
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
