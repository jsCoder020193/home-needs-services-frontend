import { Component } from "@angular/core";
import { AuthenticationService, TokenPayload, CreateUserPayload } from "../../services/authentication.service";
import { Router } from "@angular/router";

@Component({
  templateUrl: "./register.component.html"
})
export class RegisterComponent {
  // credentials: TokenPayload = {
  //   id: 0,
  //   first_name: "",
  //   last_name: "",
  //   email: "",
  //   password: ""
  // };
  
  credentials: CreateUserPayload = {
  first_name: '',
  middle_name: '',
  last_name: '',
  user_type: '',
  email: '',
  password: '',
  user_id: ''
  }
  
  currentDate = new Date();

  constructor(private auth: AuthenticationService, private router: Router) {}

  register() {
    this.auth.register(this.credentials).subscribe(
      () => {
        this.router.navigateByUrl("/profile");
      },
      err => {
        console.error(err);
      }
    );
  }
}