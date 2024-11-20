import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MessageBox } from 'src/app/core/types/message-box';
import { IonText, IonTitle } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-message-box-dialog',
  templateUrl: './message-box-dialog.component.html',
  styleUrls: ['./message-box-dialog.component.scss'],
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
export class MessageBoxDialogComponent implements OnInit {
  constructor(
    private readonly dialogRef: MatDialogRef<MessageBoxDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public readonly data: MessageBox
  ) {}

  ngOnInit() {}
}
