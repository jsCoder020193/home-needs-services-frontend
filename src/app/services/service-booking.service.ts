import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { Router } from '@angular/router'
@Injectable({
  providedIn: 'root'
})
export class ServiceBookingService {

  constructor(private http: HttpClient, private router: Router) {}

  //get quotes w/ an array of quotes ID + store this array as cookies
  public getQuotesExist(payload): Observable<any> {
    return this.http.post(`/api/quotes/exist`, payload);
  }

  public getQuotes(payload): Observable<any> {
    return this.http.post(`/api/quotes`, payload);
  }
}

