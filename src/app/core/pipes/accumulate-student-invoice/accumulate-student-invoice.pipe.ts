import { Pipe, PipeTransform } from '@angular/core';
import { StudentInvoice } from '../../types/student-invoices';

@Pipe({
  name: 'accumulateArrayValue',
  standalone: true,
})
export class AccumulateStudentInvoicePipe implements PipeTransform {
  transform(invoices: any[], key: string): number {
    return invoices.reduce((sum, student) => sum + student[key], 0);
  }
}
