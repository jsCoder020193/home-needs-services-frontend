import { Injectable } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ServiceRequest {

  // _id: string;
email: string;
service_zipcode: any;
date: {
  year: any
  month: any
  day: any
}
time: {
  hour: any,
  minute: any,
  second: any
}
service_id: string;
description: string;
no_of_hours: any;
frequency: any;
service_address_line_1: any;
service_address_line_2: any;
service_city: any;
service_state: any;

  constructor(private cookieService: CookieService) { }

  setHomeData(data){
      this.email = data.email;
      this.service_zipcode = data.zipcode;
      this.date = data.date;
      this.time = data.time;
      this.service_id = data.service_id;
      this.description = data.description;
      this.no_of_hours = data.no_of_hours;
      this.frequency = data.frequency;
      this.service_address_line_1 = data.service_address_line_1;
      this.service_address_line_2 = data.service_address_line_2;
      this.service_city = data.service_city;
      this.service_state = data.service_state;
  }

  getHomeData(){
      return{
          email: this.email || '',
          zipcode: this.service_zipcode || '',
          date: this.date || '',
          time: this.time || '',
          service_id: this.service_id || '',
          description: this.description || '',
          no_of_hours: this.no_of_hours || '',
          frequency: this.frequency,
          service_address_line_1: this.service_address_line_1 || '',
          service_address_line_2: this.service_address_line_2 || '',
          service_city: this.service_city || '',
          service_state: this.service_state || ''
      }
  }

  setCookies(data){
    const keys = Object.keys(data);
    keys.forEach(key => {
      this.cookieService.set(key,data[key]);
    });
  }

  getCookies(){
    const v = this.cookieService.getAll();
    return v;
  }

  deleteCookies(){
    this.cookieService.deleteAll();
  }

  generatePayload(serviceRequest) {
    //if service and home address same create home address payload 
    //modify field values
    const payload = {
      _id: serviceRequest._id,
      name: serviceRequest.name,
      description: serviceRequest.description || '',
      date: serviceRequest.date,
      location: location,
      type: 'user'
    };
    return payload;
  }
}

// static pattern = {
//   email: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
//   phone: '^\\+?[0-9]{0,}(?=.*)[- ()0-9]*$',
//   currency: '^\\+?[0-9]{0,}(?=.*)[., ()0-9]*$',
//   percentage: '^([0-9]{1,2}([\\.][0-9]{1,2})?$|100([\\.][0]{1,2})?)$',
//   number: '^[0-9]*$'
// };
