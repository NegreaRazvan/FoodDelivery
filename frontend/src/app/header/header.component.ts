import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {Subscription} from 'rxjs';
import {CartService} from '../services/cart/cart.service';
import {NgIf} from '@angular/common';
import {AuthentificationService} from '../services/authentification/authentification.service';
import {User} from '../shared/Model/User';

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
  currentUser: User | null = null ;
  isDropdownOpen: boolean = false;
  private cartSubscription: Subscription | undefined;
  private userSubscription: Subscription | undefined;

  constructor(private cartService: CartService, protected authService: AuthentificationService) {
  }

  ngOnInit() {
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    })
    this.cartSubscription = this.cartService.cartItemCount$.subscribe(count => {
      this.cartItemCount = count;
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription)
      this.cartSubscription.unsubscribe();
    if (this.userSubscription)
      this.userSubscription.unsubscribe();
  }

  goToCart():void{
    this.cartService.resetNumberOfNotifications();
  }

  protected readonly localStorage = localStorage;

  handleLogout() {
      this.authService.logout();
  }
}
