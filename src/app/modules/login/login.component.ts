import { Component, OnInit } from '@angular/core'
import { AuthenticationService, TokenPayload } from '../../services/authentication.service'
import { Router } from '@angular/router'
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit{
  
  activeTab;
  user_type;
  staticAlertClosed = true;
  
  credentials: TokenPayload = {
    id: 0,
    email: '',
    password: '',
    user_id: ''
  }

  constructor(private auth: AuthenticationService, private router: Router) {
    this.user_type = 'customer';
  }


  ngOnInit(): void {

  }

  onTabChange(event) {
    if(event['activeId'] ==1)
    this.user_type = 'service_provider';
    else
    this.user_type = 'customer';
    console.log(this.user_type)
  }

  login() {
    this.auth.login(this.credentials).subscribe(
      (data) => {      
        if(data['dataError']){
          this.staticAlertClosed = false;
          setTimeout(() => this.staticAlertClosed = true, 1000);
        }else{
          this.router.navigateByUrl('/profile');
        }
      },
      err => {
        console.error(err)
      }
    )
  }

}