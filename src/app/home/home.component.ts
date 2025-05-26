import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';
import {FoodService} from '../services/food/food.service';

@Component({
  selector: 'app-home',
  imports: [
    NgForOf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  foods:String[] = [];
  constructor(private foodService:FoodService) {
  }

  ngOnInit() {
    this.foods = this.foodService.getAll();
  }
}
