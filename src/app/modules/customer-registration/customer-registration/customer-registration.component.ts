import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router'

import {ServiceRequest} from '../../../entities/service-request';
import {States} from '../../../entities/states';

@Component({
  selector: 'app-customer-registration',
  templateUrl: './customer-registration.component.html',
  styleUrls: ['./customer-registration.component.css']
})
export class CustomerRegistrationComponent implements OnInit {

  serviceBookingFormValues;
  registrationForm: FormGroup; 
  formSubmitted;

  states = [];

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private _ServiceRequest: ServiceRequest,
    private _states: States) { }

  ngOnInit(): void {
    const self = this;
    self.formSubmitted = false;
    self.states = self._states.getStates();
    self.serviceBookingFormValues = self._ServiceRequest.getHomeData();
    self.buildHomeForm();
  }

  buildHomeForm() {
    const self = this;
    self.registrationForm = self.formBuilder.group({
      'email': [self.serviceBookingFormValues.email,[Validators.required, Validators.pattern(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)]],
      'first_name': ['',[Validators.required]],
      'middle_name': ['',[Validators.required]],
      'last_name': ['',[Validators.required]],
      'phone_number' : ['',[Validators.required]],
      'phone_number_type' : ['',[Validators.required]],
      'user_address_line_1': ['', [Validators.required]],
      'user_address_line_2': [''],
      'user_city': ['', [Validators.required]],
      'user_state': ['State', [Validators.required]],
      'user_zipcode': ['',[Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(5), Validators.minLength(5)]]
    });
  }

  changeAddress(event){
    if (event.target.checked) {
      console.log("y")
      //patchvalue and disable
    }else
    console.log("n")
    //do nothing
  }

  changeTnC(event){
    if (event.target.checked) {
      console.log("y")
      //patchvalue and disable
    }else
    console.log("n")
    //do nothing
  }

  onSubmit(){
    const self = this;
    self.formSubmitted = true;
    const status = self.registrationForm.status;

    if(status == 'VALID'){
      //navigate to service booking
        // self._ServiceRequest.setHomeData(self.registrationForm.value);
        // this.router.navigateByUrl('/service-request');
    }else{
      //form has errors
    }
  }

}
