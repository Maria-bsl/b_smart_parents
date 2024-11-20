import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { UnsubscriberService } from '../unsubscriber/unsubscriber.service';
import { catchError, concatMap, from, map, retry, tap, throwError } from 'rxjs';
import { FLoginForm } from 'src/app/core/forms/f-login-form';
import { isPlatform } from '@ionic/angular/standalone';
import { AddStudent } from 'src/app/core/forms/f-add-student';
import { FTimeTableForm } from 'src/app/core/forms/f-time-table-form';
import { FExamType } from 'src/app/core/forms/f-exam-type';
import { FStudentMarksForm } from 'src/app/core/forms/f-student-marks-form';
import { environment } from 'src/environments/environment';
import { ErrorStatusCode } from 'src/app/core/enums/error-status-code';
import { ErrorResponse } from 'src/app/core/interfaces/error-response';

//const REQUEST_TOKEN_ENDPOINT = 'http://183.83.33.156:92/Mobile';

@Injectable({
  providedIn: 'root',
})
export class ApiConfigService {
  //private baseUrl = environment.nmbTokenBaseUrl; //'http://183.83.33.156:92/Mobile';
  private baseUrl = 'http://183.83.33.156:85/api'; //'http://183.83.33.156:92/Mobile';
  signInFinished = new EventEmitter<any>();
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
    return this.http.post(url, body, { headers: headers }).pipe(
      this._unsubscribe.takeUntilDestroy,
      retry(3),
      catchError((err: HttpErrorResponse) => {
        return this.handleError(err);
      })
    );
  }
  signIn(body: FLoginForm) {
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
  addStudent(body: AddStudent) {
    return this.performPost(
      `${this.baseUrl}/SchoolDetails/AddStudent`,
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
