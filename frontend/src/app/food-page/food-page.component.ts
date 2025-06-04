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
  private favoriteSubscription: Subscription | undefined;
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
    if(this.favoriteSubscription)
      this.favoriteSubscription.unsubscribe();

  }

  addToCart(food: Food) {
    if(this.cartService.findOne(food.id)){
      this.router.navigateByUrl('cart-page');
      this.cartService.resetNumberOfNotifications();
      return;
    }
    this.cartService.save(food)
  }

  handleFavorite() {
    if(this.favoriteSubscription)
      this.favoriteSubscription.unsubscribe();

    console.log('Favorite');
    if(this.food.favorite) {
      console.log('Favorite');
      this.favoriteSubscription = this.foodService.unfavoriteFood(this.food.id).subscribe( f =>  this.food.favorite = !this.food.favorite);
    }
    else {
      console.log('NOTFavorite');
      this.favoriteSubscription = this.foodService.favoriteFood(this.food.id).subscribe( f =>  this.food.favorite = !this.food.favorite);
    }
  }
}
