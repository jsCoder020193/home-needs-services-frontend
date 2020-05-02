import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

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
  duration: any;
  emergency: any;
  service_address_line_1: any;
  service_address_line_2: any;
  service_city: any;
  service_state: any;

  quotesDescArray;
  SRID;
  quotes;
  customerID;
  addressID;
  constructor(private cookieService: CookieService) { }

  setHomeData(data) {
    this.email = data.email;
    this.service_zipcode = data.service_zipcode;
    this.date = data.date;
    this.time = data.time;
    this.service_id = data.service_id;
    this.description = data.description;
    this.no_of_hours = data.no_of_hours;
    this.frequency = data.frequency;
    this.duration = data.duration;
    this.emergency = data.emergency;
    this.service_address_line_1 = data.service_address_line_1;
    this.service_address_line_2 = data.service_address_line_2;
    this.service_city = data.service_city;
    this.service_state = data.service_state;
  }

  getHomeData() {
    return {
      email: this.email || '',
      service_zipcode: this.service_zipcode || '',
      date: this.date || '',
      time: this.time || '',
      service_id: this.service_id || '',
      description: this.description || '',
      no_of_hours: this.no_of_hours || '',
      frequency: this.frequency || '',
      duration: this.duration || '',
      emergency: this.emergency || '',
      service_address_line_1: this.service_address_line_1 || '',
      service_address_line_2: this.service_address_line_2 || '',
      service_city: this.service_city || '',
      service_state: this.service_state || ''
    }
  }
  setSRID(SRID) {
    this.SRID = SRID;
  }
  setAddressID(addressID) {
    this.addressID = addressID;
  }
  setCustomerID(customerID) {
    this.customerID = customerID;
  }
  setQuotesExist(quotes){
    this.quotes = quotes;
  }
  
  getJobsValues() {
    return {
      SRID: this.SRID,
      service_id: this.service_id,
      addressID: this.addressID,
      customerID: this.customerID,
      quotes: this.quotes
    }
  }

  setQuotes(q) {
    this.quotesDescArray = q;
  }
  getQuotes() {
    return this.quotesDescArray;
  }

  setCookies(data) {
    const keys = Object.keys(data);
    keys.forEach(key => {
      if (typeof (data[key]) == 'object') {
        var value = JSON.stringify(data[key]);
        this.cookieService.set(key, value);
      } else {
        this.cookieService.set(key, data[key]);
      }
    });
  }

  getCookies() {
    const v = this.cookieService.getAll();
    const keys = Object.keys(v);
    keys.forEach(key => {
      if (v[key][v[key].length - 1] == '}') {
        v[key] = JSON.parse(v[key]);
      }
    });
    return v;
  }

  getCookieByName(name) {
    return this.cookieService.get(name);
  }

  deleteCookies() {
    this.cookieService.deleteAll();
  }

  generateUserPayload(user, stripe_token) {
    const payload = {
      email: user.email || '',
      password: user.password || '',
      first_name: user.first_name || '',
      middle_name: user.middle_name || '',
      last_name: user.last_name || '',
      phone_number: user.phone_number || '',
      phone_number_type: user.phone_number_type || '',
      user_address_line_1: user.user_address_line_1 || '',
      user_address_line_2: user.user_address_line_2 || '',
      user_city: user.user_city || '',
      user_state: user.user_state || '',
      user_zipcode: user.user_zipcode || '',
      stripe_token: stripe_token || ''
    };
    return payload;
  }

  generateSRPayload(SR) {
    console.log(SR)
    const payload = {
      is_emergency: SR.emergency == 'yes' ? '1' : '0' || '',
      service_description: SR.description || '',
      services_id_fk: SR.service_id || ''
    };
    return payload;
  }

  generateSRSchedulePayload(SR, SRID) {
    var endDate;
    var startDate = SR.date;
    const durationValue = Number(SR['duration']);
    var v1 = new Date(startDate.year, startDate.month - 1, startDate.day);

    v1.setMonth(v1.getMonth() + durationValue);

    endDate = v1.getFullYear() + "-" + (v1.getMonth() + 1) + "-" + v1.getDate();
    startDate = startDate['year'] + "-" + startDate['month'] + "-" + startDate['day'];
    var timeRequested = SR.time.hour + ":" + SR.time.minute + ":00";
    const payload = {
      date_requested: startDate || {},
      time_requested: timeRequested || {},
      frequency: SR.frequency || '',
      no_of_hours: SR.no_of_hours || '',
      service_request_id_fk: SRID || '',
      end_date: endDate
    };
    return payload;
  }

  generateSRLocationPayload(SR, SRID) {
    const payload = {
      service_zipcode: SR.service_zipcode || '',
      service_address_line_1: SR.service_address_line_1 || '',
      service_address_line_2: SR.service_address_line_2 || '',
      service_city: SR.service_city || '',
      service_state: SR.service_state || '',
      SRID: SRID || ''
    };
    return payload;
  }

  generateQuotesRequestPayload(SR) {
    const payload = {
      emergency: SR.emergency || '',
      service_id: SR.service_id || '',
      date: SR.date || {},
      time: SR.time || {},
      frequency: SR.frequency || '',
      no_of_hours: SR.no_of_hours || '',
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
