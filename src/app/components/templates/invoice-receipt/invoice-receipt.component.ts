import { CommonModule, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
  zip,
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
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import * as FileSaver from 'file-saver';
import { IonText } from '@ionic/angular/standalone';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  FileOpener,
  FileOpenerOptions,
} from '@capacitor-community/file-opener';

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
    IonText,
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
  @Input() identifier: string = '';
  @ViewChild('invoiceReceipt') invoiceReceipt!: ElementRef<HTMLDivElement>;
  @ViewChild('actions') actions!: ElementRef<HTMLElement>;
  isDownloading = signal<boolean>(false);
  constructor(
    private loadingService: LoadingService,
    private jsPdfService: JspdfUtilsService,
    private appConfig: AppConfigService,
    private _dialog: MatDialog,
    private _unsubscribe: UnsubscriberService,
    private tr: TranslateService,
    private _snackBar: MatSnackBar
  ) {
    let icons = ['arrow-right', 'download'];
    this.appConfig.addIcons(icons, '/assets/bootstrap-icons');
  }

  ngOnInit() {}
  ngAfterViewInit(): void {}
  downloadInvoiceFee(event: MouseEvent) {
    this.loadingService.startLoading().then((loading) => {
      this.isDownloading.set(true);
      setTimeout(() => {
        let filename = `invoice_receipt.pdf`;
        let element = this.invoiceReceipt.nativeElement;
        this.jsPdfService.exportHtml(element, filename);
        this.isDownloading.set(false);
        this.jsPdfService.finished$
          .asObservable()
          .pipe(this._unsubscribe.takeUntilDestroy)
          .subscribe({
            next: (finished) => {
              setTimeout(() => {
                this.loadingService.dismiss();
                if (finished) {
                  let downloadedMessage = this.tr.get(
                    'defaults.labels.fileDownloaded'
                  );
                  let viewMessage = this.tr.get('defaults.view');
                  let merged = zip(downloadedMessage, viewMessage);
                  merged.pipe(this._unsubscribe.takeUntilDestroy).subscribe({
                    next: (messages) => {
                      let [msg1, msg2] = messages;
                      let snackbar = this._snackBar.open(msg1, msg2, {
                        duration: 5000,
                      });
                      snackbar
                        .onAction()
                        .pipe(this._unsubscribe.takeUntilDestroy)
                        .subscribe({
                          next: (res) => {
                            let uri$ = this.jsPdfService.getFileUri(filename);
                            uri$
                              .pipe(this._unsubscribe.takeUntilDestroy)
                              .subscribe({
                                next: (file) => {
                                  const fileOpenerOptions: FileOpenerOptions = {
                                    filePath: file.uri,
                                    contentType: 'application/pdf',
                                    openWithDefault: true,
                                  };
                                  FileOpener.open(fileOpenerOptions);
                                },
                                error: (err) =>
                                  console.error(`Failed to get file uri`, err),
                              });
                          },
                          error: (err) => console.error(err),
                        });
                    },
                    error: (err) => console.error(err),
                  });
                }
              });
            },
            error: (err) => console.error(err),
          });
      }, 1000);
    });
  }

  // downloadInvoiceFee(event: MouseEvent) {
  //   this.loadingService.startLoading().then((loading) => {
  //     let filename = `invoice_receipt.pdf`;
  //     let element = this.invoiceReceipt.nativeElement;
  //     // let actions = element.getElementsByTagName('section');
  //     // actions[0].classList.remove('block');
  //     // actions[0].classList.add('hidden');
  //     this.isDownloading.set(true);
  //     this.jsPdfService.exportHtml(element, filename);
  //     this.isDownloading.set(false);
  //     this.loadingService.dismiss();
  //     let downloadedMessage = this.tr.get('defaults.labels.fileDownloaded');
  //     let viewMessage = this.tr.get('defaults.view');
  //     let merged = zip(downloadedMessage, viewMessage);
  //     merged.pipe(this._unsubscribe.takeUntilDestroy).subscribe({
  //       next: (messages) => {
  //         let [msg1, msg2] = messages;
  //         let snackbar = this._snackBar.open(msg1, msg2, { duration: 5000 });
  //         snackbar
  //           .onAction()
  //           .pipe(this._unsubscribe.takeUntilDestroy)
  //           .subscribe({
  //             next: (res) => {
  //               let uri$ = this.jsPdfService.getFileUri(filename);
  //               uri$.pipe(this._unsubscribe.takeUntilDestroy).subscribe({
  //                 next: (file) => {
  //                   const fileOpenerOptions: FileOpenerOptions = {
  //                     filePath: file.uri,
  //                     contentType: 'application/pdf',
  //                     openWithDefault: true,
  //                   };
  //                   FileOpener.open(fileOpenerOptions);
  //                 },
  //                 error: (err) => console.error(`Failed to get file uri`, err),
  //               });
  //             },
  //             error: (err) => console.error(err),
  //           });
  //       },
  //       error: (err) => console.error(err),
  //     });
  //   });
  // }
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
