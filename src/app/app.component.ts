import { Component } from '@angular/core';
import {AuthenticationService} from './authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(public auth: AuthenticationService) {}
  services = ['Plumbing', 'Electrical', 'House Cleaning', 'Home Improvement'];
}
