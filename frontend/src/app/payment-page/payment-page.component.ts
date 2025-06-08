import { Component } from '@angular/core';
import {Order} from '../shared/Model/Order';
import {ReactiveFormsModule} from '@angular/forms';
import {CurrencyPipe} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-payment-page',
  imports: [
    ReactiveFormsModule,
    CurrencyPipe
  ],
  templateUrl: './payment-page.component.html',
  styleUrl: './payment-page.component.css'
})
export class PaymentPageComponent {

  order: Order = new Order();

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.order = navigation.extras.state['order'] as Order;
    }
    console.log(this.order)
  }


}
