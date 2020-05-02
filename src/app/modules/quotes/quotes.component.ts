import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalComponent } from '../modal/modal.component';
import { ServiceRequest } from '../../entities/service-request';
import { Services } from '../../entities/services';
import { States } from '../../entities/states';
import { CustomerRegistrationService } from '../../services/customer-registration.service';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css']
})
export class QuotesComponent implements OnInit {

  Math: any;
  quotesForm: FormGroup;
  formSubmitted;
  quotesArray;
  quotesArrayCookies;
  selectedQuote;
  quotesExistCookies;
  cookies;
  r = 4;
  ratings = [1, 2, 3, 4, 5];
  reviews = ['Could be better.',
    'Satisfactory',
    'Great job!',
    'Such a great attention to detail and complete coverage of a unique space!',
    'Wonderful wonderful!! Thank you Home Needs!'];
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
    private _ServiceRequest: ServiceRequest,
    private _states: States,
    private customerRegistrationService: CustomerRegistrationService) { }

  ngOnInit(): void {
    const self = this;
    this.Math = Math;
    self.buildForm();
    self.formSubmitted = false;
    self.quotesArray = self._ServiceRequest.getQuotes();
    self.quotesArrayCookies = JSON.parse(self._ServiceRequest.getCookieByName('quotesArray'));
    self.quotesExistCookies = JSON.parse(self._ServiceRequest.getCookieByName('quotes'));
    self.cookies = self._ServiceRequest.getCookies();
    //make a calll to get quotes
    //make a call to get ratings
  }

  getRandomInt() {
    return Math.floor(Math.random() * Math.floor(6));
  }

  buildForm() {
    const self = this;
    self.quotesForm = self.formBuilder.group({
      'quoteID': ['', [Validators.required]]
    });
  }
  handleChange(quote) {
    this.selectedQuote = quote;
    this.quotesForm.patchValue({ quoteID: this.selectedQuote['id'] })
  }
  onSubmit() {
    //update quote
    //create job
    const self = this;
    const quoteID = this.selectedQuote['id'];
    self.customerRegistrationService.updateJobConfimed({ quoteID: quoteID })
      .subscribe((result) => {
        const f = self._ServiceRequest.getJobsValues();
        var final;
        if(f['SRID'])
          final = f;
        else
          final = self.cookies;
        const q = JSON.parse(final['quotes']);
        var SPID;
        q.forEach(element => {
          if(element['q_id'] == quoteID)
            SPID = element['service_provider_id'];
        });
        const jobPayload = {
          quote_id_fk: quoteID,
          customer_id_fk: final['customerID'],
          service_provider_id_fk: SPID,
          services_id_fk: final['service_id'],
          address_id_fk: final['addressID']
        }
        self.customerRegistrationService.createJob(jobPayload)
          .subscribe((jobResult) => {
            // this.auth.register(this.credentials).subscribe(
            //   () => {
            //     this.router.navigateByUrl("/profile");
            //   },
            //   err => {
            //     console.error(err);
            //   }
            // );
            self.router.navigate(['/login']);
          }, (error) => {
            //reload page
            console.log(error)
            self.openModal('Please try again!', 'Something went wrong!');
            self.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
              self.router.navigate(['/quotes']);
            });
          })
      }, (error) => {
        //reload page
        console.log(error)
        self.openModal('Please try again!', 'Something went wrong!');
        self.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
          self.router.navigate(['/quotes']);
        });
      })
  }

  openModal(msg, title) {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.message = msg;
    modalRef.componentInstance.title = title;
  }

}
