import { Component } from '@angular/core';
import {AuthenticationService} from './services/authentication.service';
import {AppService} from './services/app.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(public appService:AppService, public auth: AuthenticationService) {
    this.login();
  }
  services = ['Plumbing', 'Electrical', 'House Cleaning', 'Home Improvement'];
  login() {
    this.appService.getServices().subscribe(
      (result) => {
        this.services = result;
      },
      err => {
        console.error(err)
      }
    )
  }
}
