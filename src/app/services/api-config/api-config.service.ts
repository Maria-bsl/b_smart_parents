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
  delay,
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
import {
  AttendanceScore,
  OverallAttendance,
} from 'src/app/core/types/attendance';
import { VehicleDetail } from 'src/app/core/interfaces/transports';
import { IPackage } from 'src/app/core/interfaces/packages';
import {
  GetSDetails,
  GetSDetailsErrorStatus,
} from 'src/app/core/interfaces/GetSDetails';
import { Router } from '@angular/router';
import { AppConfigService } from '../app-config/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class ApiConfigService {
  private baseUrl = environment.nmbTokenBaseUrl;
  //private baseUrl = 'http://183.83.33.156:85/api';
  constructor(
    private http: HttpClient,
    private _unsubscribe: UnsubscriberService,
    private router: Router,
    private appConfig: AppConfigService
  ) {}
  private handleError(err: any) {
    let msg = 'Invalid Token or Token expired';
    if (
      err.error &&
      err.error.StatusCode === 649 &&
      err.error.Message === msg
    ) {
      this.appConfig.openAlertMessageBox(
        'defaults.sessionExpired',
        'defaults.sessionExpiredMessage'
      );
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }
  private performPost<T>(url: string, body: T, headers: any) {
    const createHeaders = (headers: Map<string, string>) => {
      let heads = new HttpHeaders();
      for (let [key, value] of Object.entries(headers)) {
        heads = heads.set(key, value);
      }
      return heads;
    };

    return this.http
      .post(url, body, {
        headers: createHeaders(headers),
      })
      .pipe(
        retry(3),
        delay(1000),
        catchError((err: any) => {
          this.handleError(err);
          throw err;
        })
      ) as Observable<any>;
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
  getAttendance(body: StudentDetailsForm): Observable<OverallAttendance[]> {
    return this.performPost(
      `
      ${this.baseUrl}/SchoolDetails/GetAttendance
      `,
      body,
      {}
    );
  }
  getStudentPendingInvoices(
    body: StudentDetailsForm
  ): Observable<StudentPendingInvoice[]> {
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
  getStudentInvoices(body: StudentDetailsForm): Observable<StudentInvoice[]> {
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
    return this.getToken();
  }
  getToken() {
    let { username, password } = {
      username: 'Nmb001user',
      password: 'NMB@378139',
    };
    let basicAuth = btoa(`${username}:${password}`);
    const headers = {
      Authorization: `Basic ${basicAuth}`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Content-Type': 'application/json',
    } as any;
    return this.performPost(
      `${this.baseUrl}/SchoolDetails/GetToken`,
      {},
      headers
    );
  }
}
