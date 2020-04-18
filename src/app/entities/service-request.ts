import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceRequest {

  // _id: string;
email: string;
zipcode: any;
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

//   isEdit: boolean;

//   addHoliday$: Subject<any> = new Subject();

  constructor() { }

  setEmailZipcode(data){
    this.email = data.email;
    this.zipcode = data.zipcode;
  }

  getEmailZipcode(){
    return{
      email: this.email,
      zipcode: this.zipcode,
    }
  }

  setHomeData(data){
      this.date = data.date;
      this.time = data.time;
      this.service_id = data.service_id;
      this.description = data.description;
      this.no_of_hours = data.no_of_hours;
      this.frequency = data.frequency;
  }

  getHomeData(){
      return{
          date: this.date,
          time: this.time,
          service_id: this.service_id,
          description: this.description,
          no_of_hours: this.no_of_hours,
          frequency: this.frequency
      }
  }
//   setServiceRequest(holiday) {
//     this._id = holiday._id;
//     this.date = holiday.date;
//     this.name = holiday.name;
//     this.description = holiday.description;
//     this.location = holiday.location;
//   }

//   getServiceRequest(): any {
//     return {
//       _id: this._id || '',
//       date: this.date || '',
//       name: this.name || '',
//       description: this.description || '',
//       location: this.location || 'xyzxyzyy'
//     }
//   }

//   setIsEdit(isEdit) {
//     this.isEdit = isEdit;
//   }

//   getIsEdit() {
//     return this.isEdit;
//   }

  // generatePayload(holiday) {
  //   if (!holiday.location) {
  //     if (holiday.locationSwitch == 'Processing Unit') {
  //       holiday.location = holiday['countryOrProcessingUnit'];
  //       holiday.locationType = 'processingUnit'
  //     } else {
  //       if (holiday['town'] && holiday['town'].name != "All Towns") {
  //         holiday.location = holiday['town'];
  //         holiday.locationType = 'town';
  //       } else if (holiday['state'] && holiday['state'].name != "All States") {
  //         holiday.location = holiday['state'];
  //         holiday.locationType = 'state';
  //       } else if (holiday['countryOrProcessingUnit']) {
  //         holiday.location = holiday['countryOrProcessingUnit'];
  //         holiday.locationType = 'country';
  //       }
  //     }
  //   }
  //   const payload = {
  //     _id: holiday._id,
  //     name: holiday.name,
  //     description: holiday.description || '',
  //     date: holiday.date ? DateUtil.toStringFormat(holiday.date) : '',
  //     location: location,
  //     type: 'user'
  //   };
  //   return payload;
  // }
}


