import { Component, OnInit } from "@angular/core";
import { AuthenticationService, TokenPayload, CreateUserPayload } from "../../services/authentication.service";
import { Router } from "@angular/router";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import{ModalComponent} from '../modal/modal.component';
import {States} from '../../entities/states';
import {Services} from '../../entities/services';

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

  registrationForm: FormGroup; 
  formSubmitted;
  states = [];
  serviceCategoeies = [];
  serviceSubCategories = [];
  selectedSubCategories = [];
  emergencyValues = ['YES','NO'];

  days_array = [[{value:'SUN', selected:false},
  {value:'MON', selected:false},
  {value:'TUE', selected:false},
  {value:'WED', selected:false},
  {value:'THU', selected:false},
  {value:'FRI', selected:false},
  {value:'SAT', selected:false}]];

  selectedDays=[];
  selectedServiceID;
  services_id_list = [];
  s_list = [0];
  hourStep = 1;
  minuteStep= 60;
  from_time_error = [];
  to_time_error = [];
  price_error = [];
  service_error = [];
  sub_service_error = [];
  days_error = [];
  click_count = 0;

  constructor(private auth: AuthenticationService,
    private router: Router,
    private _states: States,
    private _services:Services, 
    private formBuilder: FormBuilder,
    private modalService: NgbModal) {}


  ngOnInit(): void {
    const self = this;
    self.formSubmitted = false;
    self.states = self._states.getStates();
    self.serviceCategoeies = self._services.getParentServices();
    self.serviceSubCategories = self._services.getChildServices();
    self.selectedSubCategories.push([]);
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
      'valid_upto': [''],
      'service_zipcode': ['',[Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(5), Validators.minLength(5)]],
      'service_address_line_1': ['', [Validators.required]],
      'service_address_line_2': [''],
      'service_city': ['', [Validators.required]],
      'service_state': ['State', [Validators.required]],
      'radius': [{value:'10',disabled:true}, [Validators.required]],
      'service': ['Select Service...'],
      'sub_service': ['Select Sub Category...'],
      'price': [''],
      'from_time': [{hour: 9, minute: 0}],
      'to_time': [{hour: 17, minute: 0}],
      'account_number': ['', [Validators.required]],
      'routing_number': ['', [Validators.required]]

    });
  }

  addService(s_index){
    if(this.click_count == 0){
      this.price_error.push(false); 
      this.service_error.push(false);
      this.sub_service_error.push(false);
      this.from_time_error.push(false);
      this.to_time_error.push(false);
      this.days_error.push(false);
    }
    if(this.click_count ==0){

      this.days_array.push([{value:'SUN', selected:false},
      {value:'MON', selected:false},
      {value:'TUE', selected:false},
      {value:'WED', selected:false},
      {value:'THU', selected:false},
      {value:'FRI', selected:false},
      {value:'SAT', selected:false}]);
    }

    this.click_count++;
    var time = this.registrationForm.get('from_time').value;
    if (time && ((time.hour < 9)||time.hour>17)) {
      this.from_time_error[s_index]=true;
    }else{
      this.from_time_error[s_index] = false;
    }
    var time2 = this.registrationForm.get('to_time').value;
    if (time2 && ((time2.hour < 9)||time2.hour>17)) {
      this.to_time_error[s_index]=true;
    }else{
      this.to_time_error[s_index] = false;
    }
    if(!this.registrationForm.get('price').value)
      this.price_error[s_index]=true;
    else
      this.price_error[s_index] = false; 

    if(!this.registrationForm.get('service').value)
      this.service_error[s_index]=true;
    else
      this.service_error[s_index] = false;

    if(!this.registrationForm.get('sub_service').value)
      this.sub_service_error[s_index]=true;
    else
      this.sub_service_error[s_index] = false;
    
    if(this.selectedDays.length>0)
      this.days_error[s_index]=false;
    else
      this.days_error[s_index] = true;

    if(!this.from_time_error[s_index] && !this.to_time_error[s_index] && !this.price_error[s_index] && !this.service_error[s_index] && !this.sub_service_error[s_index] && !this.days_error[s_index]){
      this.s_list.push(s_index);
      this.services_id_list.push({id: s_index, service_id: this.selectedServiceID, price: '', days: [], start_time: {}, end_time: {}});
      this.services_id_list[s_index]['price'] = this.registrationForm.get('price').value;
      this.services_id_list[s_index]['days'] = this.selectedDays;
      this.services_id_list[s_index]['start_time'] = this.registrationForm.get('from_time').value;
      this.services_id_list[s_index]['end_time'] = this.registrationForm.get('to_time').value;
      this.selectedSubCategories.push([]);
      this.click_count = 0;
      this.selectedDays = [];
      // this.days.forEach(day => {
      //   day['selected'] = false;
      // });
      // this.registrationForm.patchValue({service: ''});
      // this.registrationForm.patchValue({sub_service: ''});
      // this.registrationForm.patchValue({price: ''});
      // this.registrationForm.patchValue({from_time: {hour: 9, minute: 0}});
      // this.registrationForm.patchValue({to_time: {hour: 17, minute: 0}});
    }
    console.log(this.services_id_list)
  }
  
  changeDays(event,d,i,s_index){
    var index = this.selectedDays.indexOf(d);
    if (event.target.checked) {
      if(index == -1){
        //if not already added
        this.selectedDays.push(d['value']);
        this.days_array[s_index][i]['selected'] = true;
      }
      //else do nothing
    }else{
      //remove d from list
      this.selectedDays.splice(index, 1);
      this.days_array[s_index][i]['selected'] = false;
    }
  }

  handleServiceChange(s_index,serviceID){
    this.selectedSubCategories[s_index] = this.serviceSubCategories.filter(data => data['parent_id'] == serviceID);
  }

  handleSubServiceChange(s_index, subService){
    this.selectedServiceID = subService;
  }

  incrementCount(){
    var value = +(this.registrationForm.get('radius').value);
    if(value<250)
    this.registrationForm.patchValue({radius: (value+=10).toString()});
  }
  decrementCount(){
    var value = +(this.registrationForm.get('radius').value);
    if(value>10)
    this.registrationForm.patchValue({radius: (value-=10).toString()});
  }

  changeEmergencyOption(option){
    var value = option=='YES'?'1':'0';
    this.registrationForm.patchValue({value});
  }
  changeAddress(event){
    const self =  this;
    if (event.target.checked) {
      //patchvalue and disable
      const a = self.registrationForm.get('user_address_line_1').value;
      const b = self.registrationForm.get('user_address_line_2').value;
      const c = self.registrationForm.get('user_city').value;
      const d = self.registrationForm.get('user_state').value;
      const e = self.registrationForm.get('user_zipcode').value;

      self.registrationForm.patchValue({service_address_line_1: a});
      self.registrationForm.get('service_address_line_1').disable();
      self.registrationForm.patchValue({service_address_line_2: b});
      self.registrationForm.get('service_address_line_2').disable();
      self.registrationForm.patchValue({service_city: c});
      self.registrationForm.get('service_city').disable();
      self.registrationForm.patchValue({service_state: d});
      self.registrationForm.get('service_state').disable();
      self.registrationForm.patchValue({service_zipcode: e});
      self.registrationForm.get('service_zipcode').disable();
    }else{
      self.registrationForm.patchValue({service_address_line_1: ''});
      self.registrationForm.get('service_address_line_1').enable();
      self.registrationForm.patchValue({service_address_line_2: ''});
      self.registrationForm.get('service_address_line_2').enable();
      self.registrationForm.patchValue({service_city: ''});
      self.registrationForm.get('service_city').enable();
      self.registrationForm.patchValue({service_state: ''});
      self.registrationForm.get('service_state').enable();
      self.registrationForm.patchValue({service_zipcode: ''});
      self.registrationForm.get('service_zipcode').enable();
    }
  }

  onSubmit() {
    const self = this;
    self.addService(self.s_list.length-1);
    self.services_id_list = self.arrayUnique(self.services_id_list);
    console.log(self.services_id_list)
    console.log(this.registrationForm.getRawValue())
    // this.auth.register(this.credentials).subscribe(
    //   () => {
    //     this.router.navigateByUrl("/profile");
    //   },
    //   err => {
    //     console.error(err);
    //   }
    // );

    //reset all values on submit
  }


  arrayUnique (arr) {
    var service_id_arr = arr.map(a=> a['service_id']);
    console.log(service_id_arr)
    var parsed_array = [];
    var indexes = [];
    service_id_arr.forEach((item,index)=>{
        if(parsed_array.indexOf(item) == -1){
          console.log('y')
          parsed_array.push(item)
          indexes.push(index);
        }
    })
    return arr.filter((item,index)=>{
      for(var i=0;i<indexes.length;i++){
        if(index == indexes[i])
          return item;
      }
    })
  }

  openModal() {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.message = 'This is sample t&c text';
    modalRef.componentInstance.title = 'Terms & Conditions';
  }

}