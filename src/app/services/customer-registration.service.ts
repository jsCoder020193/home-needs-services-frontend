import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError, retry, map } from 'rxjs/operators'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CustomerRegistrationService {

  constructor(private http: HttpClient, private router: Router) { }

  //create user
  public registerCustomer(payload): Observable<any> {
    return this.http.post(`/api/users/register/customer`, payload);
  }

  //create SR
  public createServiceRequest(payload): Observable<any> {
    return this.http.post(`/api/servicerequest/create`, payload)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  //create SR Location
  public createServiceRequestLocation(payload): Observable<any> {
    return this.http.post(`/api/srlocation/create`, payload)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }
  //create SR Schedule
  public createServiceRequestSchedule(payload): Observable<any> {
    return this.http.post(`/api/schedule/create`, payload)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }
  //Update quotes
  public updateQuotes(payload): Observable<any> {
    return this.http.post(`/api/quotes/update`, payload)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }


  //Update quotes
  public updateJobConfimed(payload): Observable<any> {
    return this.http.post(`/api/quotes/updateJobConfimed`, payload)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  //Update quotes
  public createJob(payload): Observable<any> {
    return this.http.post(`/api/jobs/create`, payload)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      error);
  };

}
