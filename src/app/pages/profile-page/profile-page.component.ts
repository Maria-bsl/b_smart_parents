import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  standalone: true,
  imports: [IonContent],
})
export class ProfilePageComponent implements OnInit {
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<ProfilePageComponent>
  ) {}

  ngOnInit() {}
}
