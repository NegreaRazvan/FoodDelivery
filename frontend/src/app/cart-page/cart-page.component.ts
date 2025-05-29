import { Component } from '@angular/core';
import {Cart} from '../shared/Model/Cart';
import {CartService} from '../services/cart/cart.service';
import {CartItem} from '../shared/Model/CartItem';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {Subscription} from 'rxjs';
import {CartFoodCardComponent} from '../cart-food-card/cart-food-card.component';

@Component({
  selector: 'app-cart-page',
  imports: [
    NgForOf,
    RouterLink,
    CurrencyPipe,
    NgIf,
    CartFoodCardComponent
  ],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent {
  cart! : Cart;
  cartSubscription: Subscription | undefined;

  constructor(private cartService: CartService) {
  }

  ngOnInit() {
    this.cartSubscription = this.cartService.cartItems$.subscribe(cart => {
      this.cart = cart;
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription)
      this.cartSubscription.unsubscribe();
  }
}
