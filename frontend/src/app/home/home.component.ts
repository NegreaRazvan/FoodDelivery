import { Component } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {FoodService} from '../services/food/food.service';
import {Food} from '../shared/Model/Food';
import {FoodCardComponent} from '../food-card/food-card.component';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {SearchComponent} from '../search/search.component';
import {TagsComponent} from '../tags/tags.component';
import {Subscription} from 'rxjs';
import {AuthentificationService} from '../services/authentification/authentification.service';


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
  private foodServiceSubscription: Subscription | undefined;

  constructor(private foodService:FoodService, private route:ActivatedRoute, private aut: AuthentificationService) {
    console.log(aut.currentUserValue)
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params['searchTerm']) this.foodServiceSubscription = this.foodService.getAllFoodsBySearch(params['searchTerm']).subscribe(f => this.foods = f);
      else if(params['tag']) this.foodServiceSubscription=this.foodService.getAllFoodsByTag(params['tag']).subscribe(f => this.foods = f);
      else this.foodServiceSubscription=this.foodService.getAll().subscribe(f => this.foods = f);
    })
  }

  ngOnDestroy() {
    if(this.foodServiceSubscription)
      this.foodServiceSubscription.unsubscribe();
  }
}
