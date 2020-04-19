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

  frequency = ['ONE TIME','WEEKLY','BI-WEEKLY','MONTHLY','QUARTERLY','HALF YEARLY','YEARLY'];
  selectedFrequency;


  constructor(private formBuilder: FormBuilder, 
    private activatedRoute: ActivatedRoute, 
    private _ServiceRequest: ServiceRequest, 
    private _services:Services, 
    private router: Router,
    private serviceBookingService: ServiceBookingService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    const self = this;
    self.homeData = self._ServiceRequest.getEmailZipcode();
    self.buildForm();
    self.formSubmitted = false;
    self.isEmergency = true;
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
    const formData = this.serviceBookingForm.value;
    formData['email'] = self.homeData['email'];
    formData['zipcode'] = self.homeData['zipcode'];

    if(status == 'VALID'){
      var dateValid = self.validateDate();
      var timeValid = self.validateTime();
      if(dateValid && timeValid){
        /*make api call
        //if true then
        //set service data &
        //navigate to service booking
        //if false prompt user-modal*/
        // self.serviceBookingService.getQuotesExist(formData)
        self.serviceBookingService.getQuotesExist({flag: 'true'}).subscribe(
          (result) => {
            if(result['exist'] && result['exist'] == true){
              self._ServiceRequest.setHomeData(formData);
              self.router.navigateByUrl('/register/customer');
            }else{
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

  open(title,msg) {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.message = msg;
    modalRef.componentInstance.title = title;
  }

}
