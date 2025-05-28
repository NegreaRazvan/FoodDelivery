import { Component } from '@angular/core';
import {Food} from '../shared/Model/Food';
import {FoodService} from '../services/food/food.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CurrencyPipe} from '@angular/common';
import {TagsComponent} from '../tags/tags.component';
import {CartService} from '../services/cart/cart.service';

@Component({
  selector: 'app-food-page',
  imports: [
    CurrencyPipe,
    TagsComponent
  ],
  templateUrl: './food-page.component.html',
  styleUrl: './food-page.component.css'
})
export class FoodPageComponent {
  food!: Food;

  constructor(private activatedRoute:ActivatedRoute,private foodService: FoodService, private cartService: CartService,private router:Router) {
    activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.food = this.foodService.getFoodById(params['id']);
      }
    })
  }

  addToCart(food: Food) {
    if(this.cartService.findOne(food.id)){
      this.router.navigateByUrl('cart-page');
      this.cartService.resetNumberOfNotifications();
      return;
    }
    this.cartService.save(food)
  }

}
