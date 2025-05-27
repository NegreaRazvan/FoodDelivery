import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';
import {FoodService} from '../services/food/food.service';
import {Food} from '../shared/Model/Food';
import {FoodCardComponent} from '../food-card/food-card.component';
import {ActivatedRoute} from '@angular/router';
import {SearchComponent} from '../search/search.component';


@Component({
  selector: 'app-home',
  imports: [
    NgForOf,
    FoodCardComponent,
    SearchComponent
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
      console.log(params);
      if(params['searchTerm']) {
        this.foods = this.foodService.getAll().filter(food => {
          return food.name.toLowerCase().includes(params['searchTerm'].toLowerCase())
        });
      }
      else this.foods = this.foodService.getAll();
    })
  }
}
