import { Component } from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {AppService} from './app.service';
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
