import {
  trigger,
  transition,
  style,
  sequence,
  animate,
} from '@angular/animations';

export const listAnimationDesktop = trigger('listAnimationDesktop', [
  transition('void => *', [
    style({
      height: '*',
      opacity: '0',
      transform: 'translateX(-550px)',
      'box-shadow': 'none',
    }),
    sequence([
      animate(
        '.35s ease',
        style({
          height: '*',
          opacity: '.2',
          transform: 'translateX(0)',
          'box-shadow': 'none',
        })
      ),
      animate(
        '.35s ease',
        style({ height: '*', opacity: 1, transform: 'translateX(0)' })
      ),
    ]),
  ]),
]);
