import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router'

import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';

import {ServiceRequest} from '../../entities/service-request';
import {Services} from '../../entities/services';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  
  date: NgbDateStruct;
  time: NgbTimeStruct;
  hourStep = 1;
  minuteStep = 30;

  home = {
    email: '',
    zipcode: ''
  }
  
  homeForm: FormGroup;
  formSubmitted;
  serviceCategoeies = [];
  serviceSubCategories = [];

  constructor(private formBuilder: FormBuilder, private router: Router, private _ServiceRequest: ServiceRequest, public _services:Services){}

  ngOnInit() {
    const self = this;
    self.buildHomeForm();
    self.formSubmitted = false;
    self.serviceCategoeies = self._services.getParentServices();
    self.serviceSubCategories = self._services.getChildServices();
  }

  buildHomeForm() {
    const self = this;
    self.homeForm = self.formBuilder.group({
      'email': [this.home.email,[Validators.required, Validators.pattern(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)]],
      'zipcode': [this.home.zipcode,[Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(5), Validators.minLength(5)]],
      'date': [this.date,[Validators.required]],
      'time': [this.time,[Validators.required]]
    });
  }

  goToServiceBooking() {
    const self = this;
    self.formSubmitted = true;
    const status = self.homeForm.status;

    if(status == 'VALID'){
      //navigate to service booking
      var dateValid = self.validateDate();
      var timeValid = self.validateTime();
      if(dateValid && timeValid){
        self._ServiceRequest.setHomeData(self.homeForm.value);
        this.router.navigateByUrl('/service-request');
      }
    }else{
      //form has errors
    }
  }

  validateDate(){
    const self = this;
    const date = self.homeForm.get('date').value;
    
    const currentDate = new Date();
    var g1 = new Date(date['year'], date['month']-1, date['day'], 0, 0, 0); 
    if(g1>currentDate)
      return true;
    else{
      self.homeForm.controls['date'].setErrors({tooEarly: true});
      return false;
    }
    
  }

  validateTime(){
    const self = this;
    const time = self.homeForm.get('time').value;
    console.log(time)
    if (time && (time.hour < 9)) {
      self.homeForm.controls['time'].setErrors({tooEarly: true});
      return false;
    }
    if (time && (time.hour > 17)) {
      self.homeForm.controls['time'].setErrors({tooLate: true});
      return false;
    }
    return true;
  }

  // validateForm(){
  //   // (function() {
  //     'use strict';
  //     window.addEventListener('load', function() {
  //       // Fetch all the forms we want to apply custom Bootstrap validation styles to
  //       var forms = document.getElementsByClassName('needs-validation');
  //       // Loop over them and prevent submission
  //       var validation = Array.prototype.filter.call(forms, function(form) {
  //         form.addEventListener('submit', function(event) {
  //           if (form.checkValidity() === false) {
  //             event.preventDefault();
  //             event.stopPropagation();
  //           }
  //           form.classList.add('was-validated');
  //         }, false);
  //       });
  //     }, false);
  //   // })();

  // }

}