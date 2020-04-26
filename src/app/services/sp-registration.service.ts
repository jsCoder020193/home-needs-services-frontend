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
    return this.http.post(`/api/users/register/sp`, payload);
  }

  //create SR
  public createServiceOffer(payload): Observable<any> {
    return this.http.post(`/api/serviceoffer/create`, payload);
  }
  
  //create SR Location
  public createSOLocation(payload): Observable<any> {
    return this.http.post(`/api/solocation/create`, payload);
  }

}
