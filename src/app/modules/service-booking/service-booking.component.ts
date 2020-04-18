import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';

import {ServiceRequest} from '../../entities/service-request';
import {Services} from '../../entities/services';

@Component({
  selector: 'app-service-booking',
  templateUrl: './service-booking.component.html',
  styleUrls: ['./service-booking.component.css']
})
export class ServiceBookingComponent implements OnInit {

  date: NgbDateStruct;
  time: NgbTimeStruct;
  hourStep = 1;
  minuteStep = 30;

  serviceBookingForm: FormGroup;
  homeData;
  formSubmitted;

  serviceCategoeies = [];
  selectedService;
  serviceSubCategories = [];
  selectedSubCategories = [];
  subCategoryVisibile;
  selectedSubService;

  frequency = ['ONE TIME','WEEKLY','BI-WEEKLY','MONTHLY','QUARTERLY','HALF YEARLY','YEARLY'];
  selectedFrequency;


  constructor(private formBuilder: FormBuilder, 
    private activatedRoute: ActivatedRoute, 
    private _ServiceRequest: ServiceRequest, 
    private _services:Services, 
    private router: Router) { }

  ngOnInit(): void {
    const self = this;
    self.homeData = self._ServiceRequest.getEmailZipcode();
    self.buildForm();
    self.formSubmitted = false;
    self.serviceCategoeies = self._services.getParentServices();
    self.serviceSubCategories = self._services.getChildServices();
    self.subCategoryVisibile = false;
  }

  buildForm() {
    const self = this;
    self.serviceBookingForm = self.formBuilder.group({
      'service_id': ['', [Validators.required]],
      'description': [''],
      'date': [this.date,[Validators.required]],
      'time': [this.time,[Validators.required]],
      'no_of_hours': [{value: '1', disabled: true}, [Validators.required]],
      'frequency': ['', [Validators.required]]
    });
    self.serviceBookingForm.patchValue({email: self.homeData['email']});
    self.serviceBookingForm.patchValue({zipcode: self.homeData['zipcode']});
  }

  handleChange(service){
    this.selectedService = service;
    this.selectedSubCategories = this.serviceSubCategories.filter(data => data['parent_id'] == service['id']);
    this.subCategoryVisibile = true;
    // this.serviceBookingForm.patchValue({service_id: this.selectedService['id']});
  }

  handleSubServiceChange(subService){
    this.selectedSubService = subService;
    this.serviceBookingForm.patchValue({service_id: this.selectedSubService['id']});
  }

  handleFrequencyChange(f){
    this.selectedFrequency = f;
    this.serviceBookingForm.patchValue({frequency: this.selectedFrequency});
  }

  // goToCustomerRegistration(){
  //   console.log("from submit")
  // }

  onSubmit() {
    const self = this;
    self.formSubmitted = true;
    const status = self.serviceBookingForm.status;
    const formData = this.serviceBookingForm.value;
    formData['email'] = self.homeData['email'];
    formData['zipcode'] = self.homeData['zipcode'];
    console.log('Your order has been submitted', formData);
    if(status == 'VALID'){
      //navigate to service booking
      var dateValid = self.validateDate();
      var timeValid = self.validateTime();
      if(dateValid && timeValid){
        // self._ServiceRequest.setHomeData(self.serviceBookingForm.value);
        // this.router.navigateByUrl('/register/customer');
      }
    }else{
      //form has errors
    }
  }

  validateDate(){
    const self = this;
    const date = self.serviceBookingForm.get('date').value;
    
    const currentDate = new Date();
    var g1 = new Date(date['year'], date['month']-1, date['day'], 0, 0, 0); 
    if(g1>currentDate)
      return true;
    else{
      self.serviceBookingForm.controls['date'].setErrors({tooEarly: true});
      return false;
    }
    
  }

  validateTime(){
    const self = this;
    const time = self.serviceBookingForm.get('time').value;
    if (time && (time.hour < 9)) {
      self.serviceBookingForm.controls['time'].setErrors({tooEarly: true});
      return false;
    }
    if (time && (time.hour > 17)) {
      self.serviceBookingForm.controls['time'].setErrors({tooLate: true});
      return false;
    }
    return true;
  }

}
