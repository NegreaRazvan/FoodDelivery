import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {Subscription} from 'rxjs';
import {CartService} from '../services/cart/cart.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  cartItemCount: number = 0;
  private cartSubscription: Subscription | undefined;

  constructor(private cartService: CartService) {
  }

  ngOnInit() {
    this.cartSubscription = this.cartService.cartItemCount$.subscribe(count => {
      this.cartItemCount = count;
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription)
      this.cartSubscription.unsubscribe();
  }

  goToCart():void{
    this.cartService.resetNumberOfNotifications();
  }
}
