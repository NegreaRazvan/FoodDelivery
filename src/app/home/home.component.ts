import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';
import {FoodService} from '../services/food/food.service';
import {Food} from '../shared/Model/Food';
import {FoodCardComponent} from '../food-card/food-card.component';

@Component({
  selector: 'app-home',
  imports: [
    NgForOf,
    FoodCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  foods:Food[] = [];
  constructor(private foodService:FoodService) {
  }

  ngOnInit() {
    this.foods = this.foodService.getAll();
    console.log(this.foods);
  }
}
