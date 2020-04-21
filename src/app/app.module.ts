import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import{HttpClientModule} from '@angular/common/http';
import{FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router'  

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileComponent } from './modules/profile/profile.component'
import { LoginComponent } from './modules/login/login.component'
import { RegisterComponent } from './modules/register/register.component'
import { HomeComponent } from './modules/home/home.component'
import { AuthenticationService } from './services/authentication.service'
import { AuthGuardService } from './services/auth-guard.service';
import { ServiceBookingComponent } from './modules/service-booking/service-booking.component';
import { CustomerRegistrationComponent } from './modules/customer-registration/customer-registration/customer-registration.component';
import { ModalComponent } from './modules/modal/modal.component';
import { PaymentInfoComponent } from './shared/payment-info/payment-info.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register/sp', component: RegisterComponent },
  { path: 'register/customer', component: CustomerRegistrationComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'service-request',
    component: ServiceBookingComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ServiceBookingComponent,
    CustomerRegistrationComponent,
    ModalComponent,
    PaymentInfoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    NgbModule
  ],
  providers: [AuthenticationService, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule {}
