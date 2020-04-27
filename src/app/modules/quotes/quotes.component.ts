import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {ModalComponent} from '../modal/modal.component';
import {ServiceRequest} from '../../entities/service-request';
import {Services} from '../../entities/services';
import {States} from '../../entities/states';
import {CustomerRegistrationService} from '../../services/customer-registration.service';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css']
})
export class QuotesComponent implements OnInit {

  quotesForm: FormGroup;
  formSubmitted;
  quotesArray = [1,1,1,1,1,1];
  currentRate = 4;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
    private _ServiceRequest: ServiceRequest,
    private _states: States,
    private customerRegistrationService: CustomerRegistrationService) { }

  ngOnInit(): void {
    const self = this;
    self.buildForm();
    self.formSubmitted = false;
    //make a calll to get quotes
    //make a call to get ratings
  }

  buildForm() {
    const self = this;
    self.quotesForm = self.formBuilder.group({
      'service_id': ['', [Validators.required]]
    });
  }
  handleChange(quote){}
  onSubmit(){

  }

}
