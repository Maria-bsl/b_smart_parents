import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MessageBox } from 'src/app/core/types/message-box';
import { MessageBoxDialogComponent } from '../message-box-dialog/message-box-dialog.component';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { IonText, IonTitle } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-message-box',
  templateUrl: './confirm-message-box.component.html',
  styleUrls: ['./confirm-message-box.component.scss'],
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    IonText,
    IonTitle,
    TranslateModule,
  ],
})
export class ConfirmMessageBoxComponent implements OnInit {
  confirmed = new EventEmitter<void>();
  constructor(
    private readonly dialogRef: MatDialogRef<MessageBoxDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public readonly data: MessageBox
  ) {}

  ngOnInit() {}
  confirmClicked() {
    this.confirmed.emit();
  }
}
