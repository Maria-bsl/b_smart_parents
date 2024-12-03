import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.scss'],
  standalone: true,
  imports: [IonRouterOutlet],
})
export class TransportComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
