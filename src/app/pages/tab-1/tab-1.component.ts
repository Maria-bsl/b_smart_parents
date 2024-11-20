import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab-1',
  templateUrl: './tab-1.component.html',
  styleUrls: ['./tab-1.component.scss'],
  standalone: true,
  imports: [IonRouterOutlet],
})
export class Tab1Component implements OnInit {
  constructor() {}

  ngOnInit() {}
}
