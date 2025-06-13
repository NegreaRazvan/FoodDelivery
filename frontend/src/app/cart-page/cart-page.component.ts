import { Component } from '@angular/core';
import {Cart} from '../shared/Model/Cart';
import {CartService} from '../services/cart/cart.service';
import {CartItem} from '../shared/Model/CartItem';
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {CartFoodCardComponent} from '../cart-food-card/cart-food-card.component';
import {routes} from '../app.routes';

@Component({
  selector: 'app-cart-page',
  imports: [
    NgForOf,
    RouterLink,
    CurrencyPipe,
    NgIf,
    CartFoodCardComponent,
    AsyncPipe
  ],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent {
  cart$! : Observable<Cart>;

  constructor(private cartService: CartService, private router: Router) {
  }

  ngOnInit() {
    this.cart$ = this.cartService.cartItems$;
  }

  ProceedToCheckout() {
    localStorage.setItem('checkout', "access_granted");
    this.router.navigate(['/checkout']);
  }
}
