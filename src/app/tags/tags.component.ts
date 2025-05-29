import {Component, Input} from '@angular/core';
import {Tag} from '../shared/Model/Tag';
import {FoodService} from '../services/food/food.service';
import {NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';

@Component({
  selector: 'app-tags',
  imports: [
    NgIf,
    NgForOf,
    RouterLink
  ],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})
export class TagsComponent {
  @Input()
  foodPageTags?: string[] = [];
  tags?: Tag[] = [];

  constructor(private foodService:FoodService) {
  }

  ngOnInit(): void {
    if(this.foodPageTags?.length == 0)
      this.tags = this.foodService.getAllTags();
  }

}
