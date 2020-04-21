import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';

declare var Stripe; // : stripe.StripeStatic;

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.css']
})
export class PaymentInfoComponent implements OnInit {

  @Output() saveCCDetails = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    // Your Stripe public key
    const stripe = Stripe('pk_test_4nPehc8vZrCWL72wwGn9CVUF00RbQ6FyD1');

    // Create `card` element that will watch for updates
    // and display error messages
    const elements = stripe.elements();
    const card = elements.create('card');
    card.mount('#card-element');
    card.addEventListener('change', event => {
      const displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    // Listen for form submission, process the form with Stripe,
    // and get the 
    const paymentForm = document.getElementById('payment-form');
    paymentForm.addEventListener('submit', event => {
      event.preventDefault();
      stripe.createToken(card).then(result => {
        if (result.error) {
          console.log('Error creating payment method.');
          const errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          // At this point, you should send the token ID
          // to your server so it can attach
          // the payment source to a customer
          this.saveCCDetails.emit(result.token);
          console.log('Token acquired!');
          console.log(result.token);
          console.log(result.token.id);
        }
      });
    });
  }
}
