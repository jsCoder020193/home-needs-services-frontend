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

  getCookieByName(name){
    return this.cookieService.get(name);
  }

  deleteCookies(){
    this.cookieService.deleteAll();
  }

  generateUserPayload(user,stripe_token) {
    const payload = {
      email: user.email || '',
      password: user.password || '',
      first_name: user.first_name || '',
      middle_name: user.middle_name || '',
      last_name: user.last_name || '',
      phone_number: user.phone_number || '',
      phone_number_type: user.phone_number_type || '',
      user_address_line_1: user.user_address_line_1|| '',
      user_address_line_2: user.user_address_line_2|| '',
      user_city: user.user_city|| '',
      user_state: user.user_state|| '',
      user_zipcode: user.user_zipcode|| '',
      stripe_token: stripe_token || ''
    };
    return payload;
  }

  generateSRPayload(SR){
    const payload = {
      is_emergency: SR.emergency || '',
      service_description: SR.description || '',
      services_id_fk: SR.service_id || ''
    };
    return payload;
  }

  generateSRSchedulePayload(SR,SRID){
    const payload = {
      date: SR.date || {},
      time: SR.time || {},
      frequency: SR.frequency || '',
      no_of_hours: SR.no_of_hours || '',
      service_request_id_fk: SRID || ''
    };
    return payload;
  }

  generateSRLocationPayload(SR,SRID){
    const payload = {
      service_zipcode: SR.service_zipcode || '',
      service_address_line_1: SR.service_address_line_1 || '',
      service_address_line_2: SR.service_address_line_2 || '',
      service_city: SR.service_city || '',
      service_state: SR.service_state || '',
      service_request_id_fk: SRID || ''
    };
    return payload;
  }

  generateQuotesRequestPayload(SR){
    const payload = {
      emergency: SR.emergency || '',
      serviceID: SR.service_id || '',
      date: SR.date || {},
      time: SR.time || {},
      frequency: SR.frequency || '',
      no_of_hours: SR.no_of_hours || '' ,
      location: {
        city: SR.service_city || '',
        state: SR.service_state || '',
        zipcode: SR.service_zipcode || ''
      }
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
