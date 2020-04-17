import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import {ServiceRequest} from '../../entities/service-request';
import {Services} from '../../entities/services';

@Component({
  selector: 'app-service-booking',
  templateUrl: './service-booking.component.html',
  styleUrls: ['./service-booking.component.css']
})
export class ServiceBookingComponent implements OnInit {

  serviceBookingForm: FormGroup;
  email;
  zipcode;
  date;

  serviceCategoeies = [];
  selectedService;
  serviceSubCategories = [];
  selectedSubCategories = [];
  subCategoryVisibile;
  selectedSubService;
  
  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private _ServiceRequest: ServiceRequest, public _services:Services) { }

  ngOnInit(): void {
    const self = this;
    self.buildHomeForm();
    const homeData = self._ServiceRequest.getHomeData();
    self.email = homeData['email'];
    self.zipcode = homeData['zipcode'];
    self.date = homeData['date'];
    self.serviceCategoeies = self._services.getParentServices();
    self.serviceSubCategories = self._services.getChildServices();
    self.subCategoryVisibile = false;
  }

  buildHomeForm() {
    const self = this;
    self.serviceBookingForm = self.formBuilder.group({
      'email': ['', [Validators.required]],
      'zipcode': ['', [Validators.required]]
    });
  }
  handleChange(service){
    console.log(service)
    this.selectedService = service;
    this.selectedSubCategories = this.serviceSubCategories.filter(data => data['parent_id'] == service['id']);
    this.subCategoryVisibile = true;

  }

}
