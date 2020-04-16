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
// description: string;
// location: {
//     locationId: string;
//     processingUnitId: string;
//     locationName: any[];
//     locationType: string;
//     locationDescription: string;
// };

//   isEdit: boolean;

//   addHoliday$: Subject<any> = new Subject();

  constructor() { }

  setHomeData(data){
      this.email = data.email;
      this.zipcode = data.zipcode;
      this.date = data.date;
  }

  getHomeData(){
      return{
          email: this.email,
          zipcode: this.zipcode,
          date: this.date
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


