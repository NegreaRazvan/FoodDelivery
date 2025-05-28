import {Component, Input} from '@angular/core';
import {Food} from '../shared/Model/Food';
import {CartItem} from '../shared/Model/CartItem';
import {CartService} from '../services/cart/cart.service';
import {CurrencyPipe, NgForOf} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-cart-food-card',
  imports: [
    CurrencyPipe,
    RouterLink,
    NgForOf
  ],
  templateUrl: './cart-food-card.component.html',
  styleUrl: './cart-food-card.component.css'
})
export class CartFoodCardComponent {
  @Input()
  cartItem!:CartItem;

  constructor(private cartService: CartService) {}

  removeFromCart(id: number) {
    this.cartService.delete(id);
  }

  changeQuantity(id:number, quantity: string) {
    const quantityNumber = parseInt(quantity);
    this.cartService.update(id, quantityNumber);
  }
}
