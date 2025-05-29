import { Component, Input } from '@angular/core';
import {Food} from '../shared/Model/Food';
import {FoodService} from '../services/food/food.service';
import {StarRatingComponent, StarRatingConfigService, StarRatingModule} from 'angular-star-rating';
import {CurrencyPipe, NgForOf} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-food-card',
  templateUrl: './food-card.component.html',
  imports: [
    CurrencyPipe,
    RouterLink
  ],
  styleUrl: './food-card.component.css'
})
export class FoodCardComponent {
   @Input() food!:Food;
}
