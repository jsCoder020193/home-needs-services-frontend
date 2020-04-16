import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router'

import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

import {ServiceRequest} from '../../entities/service-request';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  
  date: NgbDateStruct;

  home = {
    email: '',
    zipcode: ''
  }
  
  homeForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private _ServiceRequest: ServiceRequest){}

  ngOnInit() {
    const self = this;
    self.buildHomeForm();
  }

  buildHomeForm() {
    const self = this;
    self.homeForm = self.formBuilder.group({
      'email': [this.home.email,[Validators.required, Validators.pattern(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)]],
      'zipcode': [this.home.zipcode,[Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(5), Validators.minLength(5)]],
      'date': [this.date,[Validators.required]]
    });
  }

  goToServiceBooking() {
    const self = this;
    const status = self.homeForm.status;
    console.log(this.homeForm.get('date').value)
    if(status == 'VALID'){
      //navigate to service booking
      self._ServiceRequest.setHomeData(self.homeForm.value);
      this.router.navigateByUrl('/service-request');
    }else{
      //form has errors
    }
  }

  validateForm(){
    // (function() {
      'use strict';
      window.addEventListener('load', function() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function(form) {
          form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.classList.add('was-validated');
          }, false);
        });
      }, false);
    // })();

  }

}