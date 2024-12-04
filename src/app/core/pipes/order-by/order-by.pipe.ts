import { Pipe, PipeTransform } from '@angular/core';
import { orderBy } from 'lodash';

@Pipe({
  name: 'orderBy',
  standalone: true,
})
export class OrderByPipe implements PipeTransform {
  transform(
    array: Array<any>,
    sortBy: string,
    order: boolean | 'asc' | 'desc'
  ): Array<any> {
    const sortOrder: boolean | 'asc' | 'desc' = order ? order : 'asc';
    return orderBy(array, [sortBy], [sortOrder]);
  }
}
