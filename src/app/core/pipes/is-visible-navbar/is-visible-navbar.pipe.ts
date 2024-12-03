import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isVisibleNavbar',
  standalone: true,
  pure: false,
})
export class IsVisibleNavbarPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return !location.pathname.includes('transport');
  }
}
