import { Component } from '@angular/core';
import {Food} from '../shared/Model/Food';
import {FoodService} from '../services/food/food.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CurrencyPipe, NgIf} from '@angular/common';
import {TagsComponent} from '../tags/tags.component';
import {CartService} from '../services/cart/cart.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-food-page',
  imports: [
    CurrencyPipe,
    TagsComponent,
    NgIf,
    RouterLink
  ],
  templateUrl: './food-page.component.html',
  styleUrl: './food-page.component.css'
})
export class FoodPageComponent {
  food!: Food;
  private foodServiceSubscription: Subscription | undefined;

  constructor(private activatedRoute:ActivatedRoute,private foodService: FoodService, private cartService: CartService,private router:Router) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params['id'])
        this.foodServiceSubscription=this.foodService.getFoodById(params['id']).subscribe(f => this.food = f);
    })
  }

  ngOnDestroy() {
    if (this.foodServiceSubscription)
      this.foodServiceSubscription.unsubscribe();

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
