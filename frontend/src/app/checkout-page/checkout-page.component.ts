import { Component } from '@angular/core';
import {Order} from '../shared/Model/Order';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CartService} from '../services/cart/cart.service';
import {AuthentificationService} from '../services/authentification/authentification.service';
import {OrderService} from '../services/order/order.service';
import {Subscription} from 'rxjs';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-checkout-page',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.css'
})
export class CheckoutPageComponent {
  order: Order = new Order();
  checkoutForm!: FormGroup;
  orderAddSubscription: Subscription | null = null;

  constructor(private formBuilder: FormBuilder, private cartService: CartService, private authenticationService: AuthentificationService, private orderService: OrderService) {
    this.checkoutForm = this.formBuilder.group({
      username: ['' , Validators.required],
      email: ['' , Validators.required],
      address: ['', Validators.required],
    })
    this.order.items = this.cartService.cartValue.items;
    this.order.totalPrice = this.cartService.cartValue.totalPrice;
  }

  get fg() {
    return this.checkoutForm.controls;
  }

  createOrder(){
    if(this.checkoutForm.invalid){
      return;
    }

    this.order.name = this.fg['username'].value;
    this.order.email = this.fg['email'].value;
    this.order.address = this.fg['address'].value;

    console.log(this.order);

    this.orderAddSubscription = this.orderService.save(this.order).subscribe();
  }

  ngOnInit() {
    if(this.authenticationService.currentUserValue){
      let {username, email, address} = this.authenticationService.currentUserValue;
      this.checkoutForm = this.formBuilder.group({
        username: [username , Validators.required],
        email: [email , Validators.required],
        address: [address, Validators.required],
      })
    }

    }

    ngOnDestroy() {
      if(this.orderAddSubscription)
        this.orderAddSubscription.unsubscribe();
      localStorage.setItem('checkout', 'access_denied')
    }

  protected readonly localStorage = localStorage;
}
