import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {FoodPageComponent} from './food-page/food-page.component';
import {CartPageComponent} from './cart-page/cart-page.component';
import {LoginPageComponent} from './login-page/login-page.component';
import {CheckoutPageComponent} from './checkout-page/checkout-page.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'search/:searchTerm', component: HomeComponent},
  {path: 'tag/:tag', component: HomeComponent},
  {path: 'food/:id', component: FoodPageComponent},
  {path: 'cart-page', component: CartPageComponent},
  {path: 'login-page', component: LoginPageComponent},
  {path: 'checkout', component: CheckoutPageComponent},
];
