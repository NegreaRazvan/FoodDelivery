import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {CartService} from '../services/cart/cart.service';
import {AsyncPipe, NgIf} from '@angular/common';
import {AuthentificationService} from '../services/authentification/authentification.service';
import {User} from '../shared/Model/User';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  cartItemCount$: Observable<number> | undefined;

  constructor(private cartService: CartService, protected authService: AuthentificationService) {
  }

  ngOnInit() {
    this.cartItemCount$ = this.cartService.cartItemCount$;
  }

  goToCart():void{
    this.cartService.resetNumberOfNotifications();
  }

  handleLogout() {
      this.authService.logout();
  }
}
