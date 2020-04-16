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
    this.getServices();
  }
  services = ['Plumbing', 'Electrical', 'House Cleaning', 'Home Improvement'];
  serviceCategoeies = [];
  serviceSubCategories = [];

  getServices() {
    this.appService.getServices().subscribe(
      (result) => {
        result.forEach(element => {
          var path = element['path'].toString().split('>')[0];
          var subPath = element['path'].toString().split('>')[1];
          if(subPath)
            this.serviceSubCategories.push({parent: path, title: subPath});
          else
            this.serviceCategoeies.push({title: path});
        });
        this.services = result;
      },
      err => {
        console.error(err)
      }
    )
  }
}
