import { Component, OnInit } from "@angular/core";
import { AuthenticationService, TokenPayload, CreateUserPayload } from "../../services/authentication.service";
import { Router } from "@angular/router";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {States} from '../../entities/states';

@Component({
  templateUrl: "./register.component.html",
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit  {
  // credentials: TokenPayload = {
  //   id: 0,
  //   first_name: "",
  //   last_name: "",
  //   email: "",
  //   password: ""
  // };
  active = 'Personal Details';

  credentials: CreateUserPayload = {
  first_name: '',
  middle_name: '',
  last_name: '',
  user_type: '',
  email: '',
  password: '',
  user_id: ''
  }
  
  currentDate = new Date();

  registrationForm: FormGroup; 
  formSubmitted;
  states = [];


  constructor(private auth: AuthenticationService,
    private router: Router,
    private _states: States,
    private formBuilder: FormBuilder) {}


  ngOnInit(): void {
    const self = this;
    self.formSubmitted = false;
    self.states = self._states.getStates();
    self.buildHomeForm();
  }

  buildHomeForm() {
    const self = this;
    self.registrationForm = self.formBuilder.group({
      'email': ['',[Validators.required]],
      'password': ['',[Validators.required]],
      'first_name': ['',[Validators.required]],
      'middle_name': [''],
      'last_name': ['',[Validators.required]],
      'phone_number' : ['',[Validators.required, Validators.pattern('^\\+?[0-9]{0,}(?=.*)[- ()0-9]*$')]],
      'phone_number_type' : ['',[Validators.required]],
      'user_address_line_1': ['', [Validators.required]],
      'user_address_line_2': [''],
      'user_city': ['', [Validators.required]],
      'user_state': ['State', [Validators.required]],
      'user_zipcode': ['',[Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(5), Validators.minLength(5)]],
      'ssn': ['',[Validators.required, Validators.pattern('^[0-9]*$')]],
      'bck_id_number': ['',[Validators.required]],
      'bck_id_type_id_fk': ['',[Validators.required]],
      'licence_number': [''],
      'licence_desc': [''],
      'valid_from': [''],
      'valid_upto': ['']
    });
  }

  onSubmit() {
    console.log(this.registrationForm.getRawValue())
    // this.auth.register(this.credentials).subscribe(
    //   () => {
    //     this.router.navigateByUrl("/profile");
    //   },
    //   err => {
    //     console.error(err);
    //   }
    // );
  }
}