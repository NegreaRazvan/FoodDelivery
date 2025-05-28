import { Component } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {FoodService} from '../services/food/food.service';
import {Food} from '../shared/Model/Food';
import {FoodCardComponent} from '../food-card/food-card.component';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {SearchComponent} from '../search/search.component';
import {TagsComponent} from '../tags/tags.component';


@Component({
  selector: 'app-home',
  imports: [
    NgForOf,
    FoodCardComponent,
    SearchComponent,
    TagsComponent,
    NgIf,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  foods:Food[] = [];
  constructor(private foodService:FoodService, private route:ActivatedRoute) {
  }

  ngOnInit() {
    this.foods = this.foodService.getAll();
    this.route.params.subscribe(params => {
      if(params['searchTerm'])
        this.foods = this.foodService.getAllFoodsBySearch(params['searchTerm']);
      else if(params['tag'])
        this.foods = this.foodService.getAllFoodsByTag(params['tag']);
      else this.foods = this.foodService.getAll();
    })
  }
}
