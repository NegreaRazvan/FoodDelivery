import { Component } from '@angular/core';
import {Cart} from '../shared/Model/Cart';
import {CartService} from '../services/cart/cart.service';
import {CartItem} from '../shared/Model/CartItem';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {Subscription} from 'rxjs';
import {CartFoodCardComponent} from '../cart-food-card/cart-food-card.component';
import {routes} from '../app.routes';

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

  constructor(private cartService: CartService, private router: Router) {
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

  ProceedToCheckout() {
    localStorage.setItem('checkout', "access_granted");
    this.router.navigate(['/checkout']);
  }
}
