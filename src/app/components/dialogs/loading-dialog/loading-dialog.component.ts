import { AfterViewInit, Component } from '@angular/core';
//import * as anime from 'animejs';
import anime from 'animejs/lib/anime.es';

@Component({
  selector: 'app-loading-dialog',
  standalone: true,
  imports: [],
  templateUrl: './loading-dialog.component.html',
  styleUrl: './loading-dialog.component.scss',
})
export class LoadingDialogComponent implements AfterViewInit {
  constructor() {}
  private rotateDiv() {
    anime({
      targets: '.box-1',
      loop: true,
      rotate: '1turn',
      backgroundColor: '#FFF',
      duration: 800,
    });
  }
  ngAfterViewInit(): void {
    this.rotateDiv();
  }
}
