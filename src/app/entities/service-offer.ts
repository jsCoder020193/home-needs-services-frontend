import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ServiceOffer {

  constructor() { }

  generateUserPayload(user) {
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
      ssn: user.ssn|| '',
      bck_id_number: user.bck_id_number|| '',
      bck_id_type_id_fk: user.bck_id_type_id_fk|| '',
      licence_number: user.licence_number|| '',
      licence_desc: user.licence_desc|| '',
      valid_from: user.valid_from|| '',
      valid_upto: user.valid_upto|| '',
      provides_emergency_service: user.emergency || '',
      account_number: user.account_number || '',
      routing_number: user.routing_number || ''
    };
    return payload;
  }

  generateSOPayload(SO_array,SPID){

    var payload = []; 
    SO_array.forEach(SO => {
      var startTime = SO['start_time'];
      var endTime = SO['end_time'];
      payload.push({
        services_id_fk: SO['service_id'],
        service_provider_id_fk: SPID,
        price_range: SO['price'],
        available_to_match: 1,
        start_time: startTime['hour']+':'+startTime['minute']+':00',
        end_time: endTime['hour']+':'+endTime['minute']+':00',
        days: SO['days']
      })
    });
    return payload;
  }

  generateSOLocationPayload(SO){
    const payload = {
      radius: SO.radius || '',
      service_zipcode: SO.service_zipcode || '',
      service_address_line_1: SO.service_address_line_1 || '',
      service_address_line_2: SO.service_address_line_2 || '',
      service_city: SO.service_city || '',
      service_state: SO.service_state || ''
    };
    return payload;
  }

}

