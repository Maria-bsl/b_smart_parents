import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { UnsubscriberService } from '../unsubscriber/unsubscriber.service';
import {
  catchError,
  concatMap,
  from,
  map,
  Observable,
  retry,
  tap,
  throwError,
} from 'rxjs';
import { FLoginForm } from 'src/app/core/forms/f-login-form';
import { isPlatform } from '@ionic/angular/standalone';
import {
  FDeleteStudent,
  FRegisterParent,
} from 'src/app/core/forms/f-add-student';
import {
  FBookForm,
  FTimeTableForm,
} from 'src/app/core/forms/f-time-table-form';
import { FExamType } from 'src/app/core/forms/f-exam-type';
import { FStudentMarksForm } from 'src/app/core/forms/f-student-marks-form';
import { environment } from 'src/environments/environment';
import { ErrorStatusCode } from 'src/app/core/enums/error-status-code';
import { ErrorResponse } from 'src/app/core/interfaces/error-response';
import { FTimeTableForm as StudentDetailsForm } from 'src/app/core/forms/f-time-table-form';
import {
  StudentInvoice,
  StudentPendingInvoice,
} from 'src/app/core/types/student-invoices';
import { AttendanceScore } from 'src/app/core/types/attendance';
import { VehicleDetail } from 'src/app/core/interfaces/transports';
import { IPackage } from 'src/app/core/interfaces/packages';
import {
  GetSDetails,
  GetSDetailsErrorStatus,
} from 'src/app/core/interfaces/GetSDetails';

@Injectable({
  providedIn: 'root',
})
export class ApiConfigService {
  //private baseUrl = environment.nmbTokenBaseUrl;
  private baseUrl = 'http://183.83.33.156:85/api';
  constructor(
    private http: HttpClient,
    private _unsubscribe: UnsubscriberService
  ) {}
  private handleError(err: HttpErrorResponse) {
    switch (err.status) {
      case ErrorStatusCode.NOT_FOUND:
        return throwError(() => new ErrorResponse(err.message, err.statusText));
      case ErrorStatusCode.BAD_REQUEST:
        return throwError(() => new ErrorResponse(err.message, err.statusText));
      case ErrorStatusCode.INTERNAL_SERVER_ERROR:
        return throwError(() => new ErrorResponse(err.message, err.statusText));
      case ErrorStatusCode.SUCCESS:
        return throwError(() => new ErrorResponse(err.message, err.statusText));
      default:
        return throwError(() => new ErrorResponse('No internet error'));
    }
  }
  private performPost<T>(url: string, body: T, headers: any) {
    // return this.http.post(url, body, { headers: headers }).pipe(
    //   this._unsubscribe.takeUntilDestroy,
    //   retry(3),
    //   catchError((err: HttpErrorResponse) => {
    //     return this.handleError(err);
    //   })
    // ) as Observable<any>;
    AbortSignal.timeout ??= function timeout(ms) {
      const ctrl = new AbortController();
      setTimeout(() => ctrl.abort(), ms);
      return ctrl.signal;
    };
    let promise = fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(30000),
      body: JSON.stringify(body),
    })
      .then((res) => {
        return res.json();
      })
      .catch((err) => {
        throw err;
      });
    return from(promise).pipe(
      retry(3),
      catchError((err) => {
        throw err;
      })
    );
  }
  signIn(
    body: FLoginForm
  ): Observable<GetSDetails[] | GetSDetailsErrorStatus[]> {
    return this.performPost(
      `${this.baseUrl}/SchoolDetails/GetSDetails`,
      body,
      {}
    );
  }
  getFacilities(body: {}) {
    return this.performPost(
      `${this.baseUrl}/SchoolDetails/GetFacilities`,
      body,
      {}
    );
  }
  addStudent(body: FRegisterParent) {
    return this.performPost(
      `${this.baseUrl}/SchoolDetails/AddStudent`,
      body,
      {}
    );
  }
  getAttendance(body: StudentDetailsForm) {
    return this.performPost(
      `
      ${this.baseUrl}/SchoolDetails/GetAttendance
      `,
      body,
      {}
    );
  }
  getStudentPendingInvoices(body: StudentDetailsForm) {
    return this.performPost(
      `
      ${this.baseUrl}/SchoolDetails/GetStudentPendingInvoices
      `,
      body,
      {}
    );
  }
  getParentDetails(body: { User_Name: string }) {
    return this.performPost(
      `${this.baseUrl}/SchoolDetails/GetParentDet`,
      body,
      {}
    );
  }
  changePassword(body: { Email_Address: string; New_Password: string }) {
    return this.performPost(
      `${this.baseUrl}/SchoolDetails/ChangePassword_E`,
      body,
      {}
    );
  }
  getTimeTable(body: FTimeTableForm) {
    return this.performPost(
      `${this.baseUrl}/SchoolDetails/GetTimeTable`,
      body,
      {}
    );
  }
  getExamTypes(body: FExamType) {
    return this.performPost(
      `${this.baseUrl}/SchoolDetails/GetExamTypes`,
      body,
      {}
    );
  }
  getStudentInvoices(body: StudentDetailsForm) {
    return this.performPost(
      `${this.baseUrl}/SchoolDetails/GetStudentInvoices`,
      body,
      {}
    );
  }
  getStudentPaidInvoices(body: StudentDetailsForm) {
    return this.performPost(
      `${this.baseUrl}/SchoolDetails/GetStudentPaidInvoices`,
      body,
      {}
    );
  }
  getStudentMarks(body: FStudentMarksForm) {
    return this.performPost(
      `${this.baseUrl}/SchoolDetails/GetStudentMarks`,
      body,
      {}
    );
  }
  getStudentMarkDetails(body: FStudentMarksForm) {
    return this.performPost(
      `${this.baseUrl}/SchoolDetails/GetStudentMarks_Details`,
      body,
      {}
    );
  }
  getAttendanceScore(body: StudentDetailsForm) {
    return this.performPost(
      `${this.baseUrl}/SchoolDetails/GetStudentAttendance`,
      body,
      {}
    );
  }
  registerParent(body: FRegisterParent) {
    return this.performPost(
      `${this.baseUrl}/SchoolDetails/ParentReg`,
      body,
      {}
    );
  }
  deleteStudent(body: FDeleteStudent) {
    return this.performPost(
      `${this.baseUrl}/SchoolDetails/DeleteStudent`,
      body,
      {}
    );
  }
  getRoute(body: StudentDetailsForm): Observable<VehicleDetail[]> {
    return this.performPost(`${this.baseUrl}/SchoolDetails/GetRoute`, body, {});
  }
  getBooksReturned(body: FBookForm) {
    return this.performPost(
      `${this.baseUrl}/SchoolDetails/GetR_Books`,
      body,
      {}
    );
  }
  getBooksBorrowed(body: FBookForm) {
    return this.performPost(
      `${this.baseUrl}/SchoolDetails/GetB_Books`,
      body,
      {}
    );
  }
  getPackagePriceList(body: {}): Observable<IPackage[]> {
    return this.performPost(
      `${this.baseUrl}/SchoolDetails/GetPackagePrice`,
      body,
      {}
    );
  }
  getPackageHistoryList(body: { User_Name: string }): Observable<IPackage[]> {
    return this.performPost(
      `${this.baseUrl}/SchoolDetails/GetPackageHistory`,
      body,
      {}
    );
  }
  requestToken(body: FLoginForm) {
    let { username, password } = {
      username: 'Nmb001user',
      password: 'NMB@378139',
    };
    let headers = new HttpHeaders();
    let basicAuth = btoa(`${username}:${password}`);
    const map = {
      Authorization: `Basic ${basicAuth}`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    } as any;
    Object.keys(map).forEach((key) => (headers = headers.set(key, map[key])));
    return this.performPost(
      `${this.baseUrl}/SchoolDetails/GetToken`,
      {},
      headers
    );
  }
}
