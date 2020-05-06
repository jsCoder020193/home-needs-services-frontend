import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import{HttpClientModule} from '@angular/common/http';
import{FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router'  
import { NgxSpinnerModule } from "ngx-spinner";

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
import { QuotesComponent } from './modules/quotes/quotes.component';

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
  },
  {
    path: 'quotes',
    component: QuotesComponent
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
    PaymentInfoComponent,
    QuotesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    NgbModule,
    NgxSpinnerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [AuthenticationService, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule {}
