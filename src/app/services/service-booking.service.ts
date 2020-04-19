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

  public getQuotesExist(payload): Observable<any> {
    return this.http.post(`/api/quotes/exist`, payload);
  }
}

