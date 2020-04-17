import { Component } from '@angular/core';
import {AuthenticationService} from './services/authentication.service';
import {ServicesService} from './services/services.service';
import {Services} from './entities/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(public servicesService:ServicesService, public auth: AuthenticationService, public _services:Services) {
    this.getServices();
  }
  services = ['Plumbing', 'Electrical', 'House Cleaning', 'Home Improvement'];

  getServices() {
    this.servicesService.getServices().subscribe(
      (result) => {
        this._services.setServices(result);
        this.services = result;
      },
      err => {
        console.error(err)
      }
    )
  }
}
