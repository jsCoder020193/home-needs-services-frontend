import { Injectable } from '@angular/core';

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

  constructor() { }

  setHomeData(data){
      this.email = data.email;
      this.service_zipcode = data.zipcode;
      this.date = data.date;
      this.time = data.time;
      this.service_id = data.service_id;
      this.description = data.description;
      this.no_of_hours = data.no_of_hours;
      this.frequency = data.frequency;
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
          frequency: this.frequency
      }
  }

  generatePayload(serviceRequest) {

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


