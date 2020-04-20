import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import{ModalComponent} from '../../modal/modal.component';
import {ServiceRequest} from '../../../entities/service-request';
import {States} from '../../../entities/states';

@Component({
  selector: 'app-customer-registration',
  templateUrl: './customer-registration.component.html',
  styleUrls: ['./customer-registration.component.css']
})
export class CustomerRegistrationComponent implements OnInit {

  serviceBookingFormValues;
  cookieValues;
  registrationForm: FormGroup; 
  formSubmitted;
  termsAccepted;
  showTnCError;

  states = [];

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
    private _ServiceRequest: ServiceRequest,
    private _states: States) { }

  ngOnInit(): void {
    const self = this;
    self.formSubmitted = false;
    self.states = self._states.getStates();
    self.serviceBookingFormValues = self._ServiceRequest.getHomeData();
    self.cookieValues = self._ServiceRequest.getCookies();
    console.log(self.serviceBookingFormValues)
    console.log(self.cookieValues)
    self.buildHomeForm();
    self.termsAccepted = false;
    self.showTnCError = false;
  }

  buildHomeForm() {
    const self = this;
    self.registrationForm = self.formBuilder.group({
      'email': ['',[Validators.required]],
      'first_name': ['',[Validators.required]],
      'middle_name': ['',[Validators.required]],
      'last_name': ['',[Validators.required]],
      'phone_number' : ['',[Validators.required, Validators.pattern('^\\+?[0-9]{0,}(?=.*)[- ()0-9]*$')]],
      'phone_number_type' : ['',[Validators.required]],
      'user_address_line_1': ['', [Validators.required]],
      'user_address_line_2': [''],
      'user_city': ['', [Validators.required]],
      'user_state': ['State', [Validators.required]],
      'user_zipcode': ['',[Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(5), Validators.minLength(5)]],
      'cc_number': ['', [Validators.required]],
      'cc_expiry': ['', [Validators.required]],
      'cc_cvv': ['', [Validators.required]],
      'cc_name': ['', [Validators.required]]
    });
    const emailValue = self.serviceBookingFormValues['email']?self.serviceBookingFormValues['email']:self.cookieValues['email'];
    self.registrationForm.patchValue({email: emailValue});
    self.registrationForm.get('email').disable();
  }

  changeAddress(event){
    const self =  this;
    if (event.target.checked) {
      //patchvalue and disable
      const a = self.serviceBookingFormValues['service_address_line_1']?self.serviceBookingFormValues['service_address_line_1']:self.cookieValues['service_address_line_1'];
      const b = self.serviceBookingFormValues['service_address_line_2']?self.serviceBookingFormValues['service_address_line_2']:self.cookieValues['service_address_line_2'];
      const c = self.serviceBookingFormValues['service_city']?self.serviceBookingFormValues['service_city']:self.cookieValues['service_city'];
      const d = self.serviceBookingFormValues['service_state']?self.serviceBookingFormValues['service_state']:self.cookieValues['service_state'];
      const e = self.serviceBookingFormValues['service_zipcode']?self.serviceBookingFormValues['service_zipcode']:self.cookieValues['service_zipcode'];
    
      self.registrationForm.patchValue({user_address_line_1: a});
      self.registrationForm.get('user_address_line_1').disable();
      self.registrationForm.patchValue({user_address_line_2: b});
      self.registrationForm.get('user_address_line_2').disable();
      self.registrationForm.patchValue({user_city: c});
      self.registrationForm.get('user_city').disable();
      self.registrationForm.patchValue({user_state: d});
      self.registrationForm.get('user_state').disable();
      self.registrationForm.patchValue({user_zipcode: e});
      self.registrationForm.get('user_zipcode').disable();
    }else{
      self.registrationForm.patchValue({user_address_line_1: ''});
      self.registrationForm.get('user_address_line_1').enable();
      self.registrationForm.patchValue({user_address_line_2: ''});
      self.registrationForm.get('user_address_line_2').enable();
      self.registrationForm.patchValue({user_city: ''});
      self.registrationForm.get('user_city').enable();
      self.registrationForm.patchValue({user_state: ''});
      self.registrationForm.get('user_state').enable();
      self.registrationForm.patchValue({user_zipcode: ''});
      self.registrationForm.get('user_zipcode').enable();
    }
  }

  changeTnC(event){
    if (event.target.checked) {
      this.termsAccepted = true;
    }else
    this.termsAccepted = false;
  }

  onSubmit(){
    const self = this;
    self.formSubmitted = true;
    const status = self.registrationForm.status;
    console.log(self.registrationForm.value)
    if(self.termsAccepted){
      self.showTnCError = false;
      if(status == 'VALID'){
        //register customer 
        //add service request to db
        //delete all cookies
        //send twilio request
        // save cc to stripe
          // self._ServiceRequest.setHomeData(self.registrationForm.value);
          // this.router.navigateByUrl('/service-request');
      }else{
        //form has errors
      }
    } else{
      self.showTnCError = true;
    }

  }

  openModal() {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.message = 'This is sample t&c text';
    modalRef.componentInstance.title = 'Terms & Conditions';
  }

}
