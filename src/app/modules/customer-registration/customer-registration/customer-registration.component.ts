import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalComponent } from '../../modal/modal.component';
import { ServiceRequest } from '../../../entities/service-request';
import { States } from '../../../entities/states';
import { CustomerRegistrationService } from '../../../services/customer-registration.service';
declare var Stripe; // : stripe.StripeStatic;

@Component({
  selector: 'app-customer-registration',
  templateUrl: './customer-registration.component.html',
  styleUrls: ['./customer-registration.component.css']
})
export class CustomerRegistrationComponent implements OnInit {


  // Your Stripe public key
  stripe;
  card;

  serviceBookingFormValues;
  cookieValues;
  registrationForm: FormGroup;
  formSubmitted;
  termsAccepted;
  showTnCError;

  states = [];

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
    private _ServiceRequest: ServiceRequest,
    private _states: States,
    private customerRegistrationService: CustomerRegistrationService) { }

  ngOnInit(): void {
    const self = this;
    self.formSubmitted = false;
    self.states = self._states.getStates();
    self.serviceBookingFormValues = self._ServiceRequest.getHomeData();
    self.cookieValues = self._ServiceRequest.getCookies();
    console.log(self.serviceBookingFormValues)
    console.log(self.cookieValues)
    self.buildHomeForm();
    self.termsAccepted = false;
    self.showTnCError = false;
    self.initiateStripe();
  }

  buildHomeForm() {
    const self = this;
    self.registrationForm = self.formBuilder.group({
      'email': ['', [Validators.required]],
      'password': ['', [Validators.required]],
      'first_name': ['', [Validators.required]],
      'middle_name': [''],
      'last_name': ['', [Validators.required]],
      'phone_number': ['', [Validators.required, Validators.pattern('^\\+?[0-9]{0,}(?=.*)[- ()0-9]*$')]],
      'phone_number_type': ['', [Validators.required]],
      'user_address_line_1': ['', [Validators.required]],
      'user_address_line_2': [''],
      'user_city': ['', [Validators.required]],
      'user_state': ['State', [Validators.required]],
      'user_zipcode': ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(5), Validators.minLength(5)]]
    });
    const emailValue = self.serviceBookingFormValues['email'] ? self.serviceBookingFormValues['email'] : self.cookieValues['email'];
    self.registrationForm.patchValue({ email: emailValue });
    self.registrationForm.get('email').disable();
  }

  changeAddress(event) {
    const self = this;
    if (event.target.checked) {
      //patchvalue and disable
      const a = self.serviceBookingFormValues['service_address_line_1'] ? self.serviceBookingFormValues['service_address_line_1'] : self.cookieValues['service_address_line_1'];
      const b = self.serviceBookingFormValues['service_address_line_2'] ? self.serviceBookingFormValues['service_address_line_2'] : self.cookieValues['service_address_line_2'];
      const c = self.serviceBookingFormValues['service_city'] ? self.serviceBookingFormValues['service_city'] : self.cookieValues['service_city'];
      const d = self.serviceBookingFormValues['service_state'] ? self.serviceBookingFormValues['service_state'] : self.cookieValues['service_state'];
      const e = self.serviceBookingFormValues['service_zipcode'] ? self.serviceBookingFormValues['service_zipcode'] : self.cookieValues['service_zipcode'];

      self.registrationForm.patchValue({ user_address_line_1: a });
      self.registrationForm.get('user_address_line_1').disable();
      self.registrationForm.patchValue({ user_address_line_2: b });
      self.registrationForm.get('user_address_line_2').disable();
      self.registrationForm.patchValue({ user_city: c });
      self.registrationForm.get('user_city').disable();
      self.registrationForm.patchValue({ user_state: d });
      self.registrationForm.get('user_state').disable();
      self.registrationForm.patchValue({ user_zipcode: e });
      self.registrationForm.get('user_zipcode').disable();
    } else {
      self.registrationForm.patchValue({ user_address_line_1: '' });
      self.registrationForm.get('user_address_line_1').enable();
      self.registrationForm.patchValue({ user_address_line_2: '' });
      self.registrationForm.get('user_address_line_2').enable();
      self.registrationForm.patchValue({ user_city: '' });
      self.registrationForm.get('user_city').enable();
      self.registrationForm.patchValue({ user_state: '' });
      self.registrationForm.get('user_state').enable();
      self.registrationForm.patchValue({ user_zipcode: '' });
      self.registrationForm.get('user_zipcode').enable();
    }
  }

  changeTnC(event) {
    if (event.target.checked) {
      this.termsAccepted = true;
    } else
      this.termsAccepted = false;
  }

  onSubmit() {
    const self = this;
    self.formSubmitted = true;
    const status = self.registrationForm.status;
    const formValue = self.registrationForm.getRawValue();
    console.log(formValue)
    if (self.termsAccepted) {
      self.showTnCError = false;
      if (status == 'VALID') {
        //send twilio request

        // save cc to stripe
        self.saveStripeToken().then(function (stripe_token) {
          //register customer 
          const userPayload = self._ServiceRequest.generateUserPayload(formValue, stripe_token);
          console.log(userPayload)
          self.customerRegistrationService.registerCustomer(userPayload)
            .subscribe((result) => {
              console.log(result)
              if (result['errno']) {
                self.openModal(result['displayMessage'] ? result['displayMessage'] : result['sqlMessage'], 'Something went wrong!');
                self.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
                  self.router.navigate(['/']);
                });
              } else if (result['dataError']) {
                self.openModal(result['dataError'], 'Something went wrong!');
                self.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
                  self.router.navigate(['/']);
                });
              } else {
                //add service request to db
                self._ServiceRequest.setCookies({customerID: result['customerID']});
                self._ServiceRequest.setCustomerID(result['customerID']);
                const SRpayload = self._ServiceRequest.generateSRPayload(self.serviceBookingFormValues['email'] ? self.serviceBookingFormValues : self.cookieValues);
                SRpayload['customer_id_fk'] = result['customerID'];
                console.log(SRpayload)
                self.customerRegistrationService.createServiceRequest(SRpayload)
                  .subscribe((SRResult) => {
                    console.log(SRResult)
                    if (result['errno']) {
                      self.openModal(result['displayMessage'] ? result['displayMessage'] : result['sqlMessage'], 'Something went wrong!');
                      self.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
                        self.router.navigate(['/']);
                      });
                    } else {
                      //add sr_location
                      var SRID;
                      if (SRResult && SRResult['SRID'])
                        SRID = SRResult['SRID'];
                      const SRLocationPayload = self._ServiceRequest.generateSRLocationPayload(self.serviceBookingFormValues['email'] ? self.serviceBookingFormValues : self.cookieValues, SRID);
                      console.log(SRLocationPayload)
                      self.customerRegistrationService.createServiceRequestLocation(SRLocationPayload)
                        .subscribe((SRLResult) => {
                          self._ServiceRequest.setAddressID(SRLResult);
                          self._ServiceRequest.setCookies({addressID: SRLResult});
                          console.log(SRLResult)
                          //add sr_schedule
                          var SRID;
                          if (SRResult && SRResult['SRID'])
                            SRID = SRResult['SRID'];
                          const SRSchedulePayload = self._ServiceRequest.generateSRSchedulePayload(self.serviceBookingFormValues['email'] ? self.serviceBookingFormValues : self.cookieValues, SRID);

                          console.log(SRSchedulePayload)
                          self.customerRegistrationService.createServiceRequestSchedule(SRSchedulePayload)
                            .subscribe((SRSResult) => {
                              console.log(SRSResult)
                              const updateQuotesPayload = {
                                service_request_id: SRResult['SRID'] || '',
                                quotes_array: self.cookieValues['quotes']
                              }
                              console.log(updateQuotesPayload)
                              
                              self.customerRegistrationService.updateQuotes(updateQuotesPayload)
                                .subscribe((result) => {
                                  console.log(result)
                                  self._ServiceRequest.setCookies({SRID: SRResult['SRID']});
                                  self._ServiceRequest.setSRID(SRResult['SRID']);
                                  //delete all cookies
                                  self._ServiceRequest.setQuotes(result);
                                  self._ServiceRequest.setCookies({quotesArray: result});
                                  //Navigate to quotes page
                                  // self._ServiceRequest.setHomeData(self.registrationForm.value);
                                  self.router.navigate(['/quotes']);
                                }, (error) => {
                                  //reload page
                                  console.log(error)
                                  self.openModal('Please try again!', 'Something went wrong!');
                                  self.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
                                    self.router.navigate(['/']);
                                  });
                                })
                            }, (error) => {
                              //reload page
                              console.log(error)
                              self.openModal('Please try again!', 'Something went wrong!');
                              self.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
                                self.router.navigate(['/']);
                              });
                            })
                        }, (error) => {
                          //reload page
                          console.log(error)
                          self.openModal('Please try again!', 'Something went wrong!');
                          self.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
                            self.router.navigate(['/']);
                          });
                        })
                    }
                  }, (error) => {
                    //reload page
                    console.log(error)
                    self.openModal('Please try again!', 'Something went wrong!');
                    self.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
                      self.router.navigate(['/']);
                    });
                  })
              }
            }, (error) => {
              //reload page
              console.log(error)
              self.openModal('Please try again!', 'Something went wrong!');
              self.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
                self.router.navigate(['/']);
              });
            })
        })
          .catch((err) => {
            console.log(err)
            self.openModal('Please try again!', 'Something went wrong!');
            self.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
              self.router.navigate(['/']);
            });
          })

      } else {
        //form has errors
      }
    } else {
      self.showTnCError = true;
    }

  }

  initiateStripe() {

    this.stripe = Stripe('pk_test_4nPehc8vZrCWL72wwGn9CVUF00RbQ6FyD1');

    // Create `card` element that will watch for updates
    // and display error messages
    const elements = this.stripe.elements();
    this.card = elements.create('card');
    this.card.mount('#card-element');
    this.card.addEventListener('change', event => {
      const displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
  }

  saveStripeToken() {
    return new Promise((resolve, reject) => {
      this.stripe.createToken(this.card).then(result => {
        if (result.error) {
          console.log('Error creating payment method.');
          const errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
          reject(result.error);
        } else {
          console.log('Token acquired!');
          console.log(result.token.id);
          resolve(result.token.id);
        }
      });
    });
  }

  openModal(msg, title) {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.message = msg;
    modalRef.componentInstance.title = title;
  }


}
