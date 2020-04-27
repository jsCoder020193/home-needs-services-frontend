import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError, retry, map } from 'rxjs/operators'
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class SpRegistrationService {

  constructor(private http: HttpClient, private router: Router) { }

  //create user
  public registerServiceProvider(payload): Observable<any> {
    return this.http.post(`/api/users/register/sp`, payload)
    .pipe(
      catchError(this.handleError) // then handle the error
    );
  }

  //create SR
  public createServiceOffer(payload): Observable<any> {
    return this.http.post(`/api/serviceoffer/create`, payload)
    .pipe(
      catchError(this.handleError) // then handle the error
    );
  }
  
  //create SR Location
  public createSOLocation(payload): Observable<any> {
    return this.http.post(`/api/solocation/create`, payload)
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
