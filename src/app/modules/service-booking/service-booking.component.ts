import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {ServiceRequest} from '../../entities/service-request';
import {Services} from '../../entities/services';
import {ServiceBookingService} from '../../services/service-booking.service';
import{ModalComponent} from '../modal/modal.component';
import {States} from '../../entities/states';

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
  emergencyValues = ['YES','NO'];
  isEmergency;
  states = [];

  frequency = [{name:'ONE TIME', value: 'one_time'},
  {name: 'WEEKLY', value: 'weekly'},
  {name: 'BI-WEEKLY', value: 'biweekly'},
  {name: 'MONTHLY', value: 'monthly'},
  {name: 'QUARTERLY', value: 'quarterly'},
  {name: 'HALF YEARLY', value: 'semi_annual'},
  {name: 'YEARLY', value: 'annual'}];
  selectedFrequency;


  constructor(private formBuilder: FormBuilder, 
    private activatedRoute: ActivatedRoute, 
    private _ServiceRequest: ServiceRequest, 
    private _services:Services, 
    private router: Router,
    private serviceBookingService: ServiceBookingService,
    private modalService: NgbModal,
    private _states: States) { }

  ngOnInit(): void {
    const self = this;
    self.homeData = self._ServiceRequest.getHomeData();
    self.buildForm();
    self.formSubmitted = false;
    self.isEmergency = true;
    self.states = self._states.getStates();
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
      'emergency': ['',[Validators.required]],
      'no_of_hours': [{value: '1', disabled: true}],
      'frequency': ['', [Validators.required]],
      'service_zipcode': [{value: self.homeData['service_zipcode']?self.homeData['service_zipcode']:''}],
      'service_address_line_1': ['', [Validators.required]],
      'service_address_line_2': [''],
      'service_city': ['', [Validators.required]],
      'service_state': ['State', [Validators.required]]
    });
    self.serviceBookingForm.patchValue({email: self.homeData['email']});
    self.serviceBookingForm.patchValue({service_zipcode: self.homeData['service_zipcode']});
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
    this.serviceBookingForm.patchValue({frequency: this.selectedFrequency['value']});
  }

  changeEmergencyOption(option){
    if(option == 'NO')
      this.isEmergency = false;
    else
      this.isEmergency = true;

    this.serviceBookingForm.patchValue({emergency: option.toString().toLowerCase()});
  }

  onSubmit() {
    const self = this;
    self.formSubmitted = true;
    const status = self.serviceBookingForm.status;
    const formData = this.serviceBookingForm.getRawValue();
    formData['email'] = self.homeData['email'];
    if(status == 'VALID'){
      var dateValid = self.validateDate();
      var timeValid = self.validateTime();
      if(dateValid && timeValid){
        /*make api call
        //if true then
        //set service data &
        //navigate to service booking
        //if false prompt user-modal*/
        const quotePayload = self._ServiceRequest.generateQuotesRequestPayload(formData);
        //TO-DO
        // self.serviceBookingService.getQuotes(quotePayload)
        // .subscribe((result)=>{

        // })
        self.serviceBookingService.getQuotesExist({flag: 'true'}).subscribe(
          (result) => {
            if(result['exist'] && result['exist'] == true){
              self._ServiceRequest.setHomeData(formData);
              self._ServiceRequest.setCookies(formData);
              const quotesArray = {
                quotes: ['q1','q2','q3','q4','q5']
              };
              self._ServiceRequest.setCookies(quotesArray);
              self.router.navigateByUrl('/register/customer');
            }else{
              /*******************TO-DO reset all cookies except email and zipcode*/
              const msg = "We are unable to find availables service providers to match your request at this time! Please select a different date or time!";
              const title = "Sorry!";
              self.open(title,msg);
              //reset date and time
              self.serviceBookingForm.patchValue({date: ''});
              self.serviceBookingForm.patchValue({time: ''});
            }
          },
          err => {
            console.error(err)
            //something went wrong-modal
            const msg = "We are experiencing some error! Please try again.";
            const title = "Sorry!";
            self.open(title,msg);
          }
        )
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

  incrementCount(){
    var value = +(this.serviceBookingForm.get('no_of_hours').value);
    if(value<10)
    this.serviceBookingForm.patchValue({no_of_hours: (++value).toString()});
  }
  decrementCount(){
    var value = +(this.serviceBookingForm.get('no_of_hours').value);
    if(value>1)
    this.serviceBookingForm.patchValue({no_of_hours: (--value).toString()});
  }

  open(title,msg) {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.message = msg;
    modalRef.componentInstance.title = title;
  }

}
