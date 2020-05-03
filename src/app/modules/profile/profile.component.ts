import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService, UserDetails } from '../../services/authentication.service'
import { CustomerRegistrationService } from '../../services/customer-registration.service';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modal/modal.component';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  details: UserDetails
  userDetails;
  jobs;
  userType;
  constructor(private auth: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
    private customerRegistrationService: CustomerRegistrationService) {}

  ngOnInit() {
    const self = this;
    self.auth.profile().subscribe(
      user => {
        self.details = user
        self.userDetails = user;
        self.userType = self.userDetails['user_type'];
        const userID = self.userDetails['user_id_fk'];
        if(self.userType == "customer"){
          self.customerRegistrationService.getJobsForCustomer(userID)
          .subscribe((jobResult) => {
            // self.router.navigate(['/login']);
            console.log(jobResult)
            self.jobs = jobResult;
          }, (error) => {
            //reload page
            console.log(error)
          })
        }else{
          self.customerRegistrationService.getJobsForSP(userID)
          .subscribe((jobResult) => {
            // self.router.navigate(['/login']);
            console.log(jobResult)
            self.jobs = jobResult;
          }, (error) => {
            //reload page
            console.log(error)
          })
        }
      },
      err => {
        console.error(err)
      }
    )
  }

  openModal(msg, title) {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.message = msg;
    modalRef.componentInstance.title = title;
  }
}