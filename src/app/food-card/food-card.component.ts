import { Component, Input } from '@angular/core';
import {Food} from '../shared/Model/Food';
import {FoodService} from '../services/food/food.service';

@Component({
  selector: 'app-food-card',
  imports: [],
  templateUrl: './food-card.component.html',
  styleUrl: './food-card.component.css'
})
export class FoodCardComponent {
   @Input() food!:Food;
}
