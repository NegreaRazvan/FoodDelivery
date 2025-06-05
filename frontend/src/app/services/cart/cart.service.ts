import { Injectable } from '@angular/core';
import {Cart} from '../../shared/Model/Cart';
import {Food} from '../../shared/Model/Food';
import {CartItem} from '../../shared/Model/CartItem';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Cart = new Cart();

  //subscribers will get the number stored here, which will be how many type of items there are
  private cartItemCountSubject: BehaviorSubject<number>;
  private cartItems: BehaviorSubject<Cart>;
  //dollar naming convention
  cartItemCount$: Observable<number> = new Observable<number>();
  cartItems$: Observable<Cart>;

  constructor(){
    this.cartItemCountSubject = new BehaviorSubject<number>(this.cart.items.length);
    this.cartItemCount$ = this.cartItemCountSubject.asObservable();
    this.cartItems = new BehaviorSubject<Cart>(this.cart);
    this.cartItems$ = this.cartItems.asObservable();
  }

  resetNumberOfNotifications(): void {
    this.cartItemCountSubject.next(0);
  }

  get cartValue(): Cart{
    return this.cart;
  }

  save(food:Food): void {
    let cartItem = this.findOne(food.id);
    if (cartItem) {
      this.update(food.id, cartItem.quantity + 1);
      return;
    }
    this.cart.items.push(new CartItem(food));
    const currentCount = this.cartItemCountSubject.getValue();
    this.cartItemCountSubject.next(currentCount + 1);
    this.cartItems.next(this.cart)
  }

  update(id: number, quantity: number) {
    let cartItem = this.findOne(id);
    if (!cartItem) return;
    cartItem.quantity = quantity;
    this.cartItems.next(this.cart)
  }

  delete(id: number): CartItem | undefined {
    const deletedItem = this.findOne(id);
    this.cart.items = this.cart.items.filter(item => item.food.id !== id);
    this.cartItems.next(this.cart)
    return deletedItem;
  }

  findAll() {
    return this.cart;
  }

  findOne(id: number) {
    return this.cart.items.find(item => item.food.id === id);
  }


}
