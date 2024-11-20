import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root',
})
export class JspdfUtilsService {
  constructor() {}
  exportHtmlToPdf(element: HTMLElement, width: number = 0, height: number = 0) {
    let doc = new jsPDF(
      element.clientWidth > element.clientHeight ? 'l' : 'p',
      'mm',
      [element.clientWidth, element.clientHeight]
    );
    doc.html(element, {
      callback(doc) {
        doc.save('results.pdf');
      },
    });
  }
  exportStudentMarksReportToPdf(element: HTMLElement, title: string) {}
}
