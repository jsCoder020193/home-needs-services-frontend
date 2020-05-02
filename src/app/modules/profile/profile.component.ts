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
  constructor(private auth: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
    private customerRegistrationService: CustomerRegistrationService) {}

  ngOnInit() {
    const self = this;
    self.auth.profile().subscribe(
      user => {
        console.log("from profile component")
        console.log(user)
        self.details = user
        self.userDetails = user;
        const userType = self.userDetails['user_type'];
        const userID = self.userDetails['user_id_fk'];
        if(userType == "customer"){
          self.customerRegistrationService.getJobsForCustomer(userID)
          .subscribe((jobResult) => {
            // self.router.navigate(['/login']);
            console.log(jobResult)
          }, (error) => {
            //reload page
            console.log(error)
            self.openModal('Please try again!', 'Something went wrong!');
            self.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
              self.router.navigate(['/profile']);
            });
          })
        }else{
          self.customerRegistrationService.getJobsForSP(userID)
          .subscribe((jobResult) => {
            // self.router.navigate(['/login']);
            console.log(jobResult)
          }, (error) => {
            //reload page
            console.log(error)
            self.openModal('Please try again!', 'Something went wrong!');
            self.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
              self.router.navigate(['/profile']);
            });
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