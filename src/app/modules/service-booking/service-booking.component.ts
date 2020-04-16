import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import {ServiceRequest} from '../../entities/service-request';


@Component({
  selector: 'app-service-booking',
  templateUrl: './service-booking.component.html',
  styleUrls: ['./service-booking.component.css']
})
export class ServiceBookingComponent implements OnInit {

  serviceBookingForm: FormGroup;
  email;
  zipcode;

  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private _ServiceRequest: ServiceRequest) { }

  ngOnInit(): void {
    const self = this;
    self.buildHomeForm();
    // self.activatedRoute.queryParams.subscribe(params => {
    //   this.email = params['email'];
    //   this.zipcode = params['zipcode'];

    // });
    const homeData = self._ServiceRequest.getHomeData();
    self.email = homeData['email'];
    self.zipcode = homeData['zipcode'];
  }

  buildHomeForm() {
    const self = this;
    self.serviceBookingForm = self.formBuilder.group({
      'email': ['', [Validators.required]],
      'zipcode': ['', [Validators.required]]
    });
  }

  getServices() {
    const self = this;
    const params ={
      sort:'name'
    }
    // self.processingUnitService.getProcessingUnits(params).subscribe((response) => {
    //   self.processingUnits = response;
    // });
  }

  getSubServices(){

  }

}
