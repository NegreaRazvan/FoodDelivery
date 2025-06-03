import { Injectable } from '@angular/core';
import {Food} from '../../shared/Model/Food';
import {Tag} from '../../shared/Model/Tag';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthentificationService} from '../authentification/authentification.service';
import {map, Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private readonly API_URL = 'http://localhost/OnlineRestaurant';
  private readonly FOODS_API_URL= `${this.API_URL}/foods`;

  constructor(private http: HttpClient, private authService: AuthentificationService) {}

  private getAuthHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      });
    }
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  getAllTags(): Tag[]{
    return [
      { name: 'All', count: 6 },
      { name: 'FastFood', count: 4 },
      { name: 'Pizza', count: 2 },
      { name: 'Lunch', count: 3 },
      { name: 'SlowFood', count: 2 },
      { name: 'Hamburger', count: 1 },
      { name: 'Fry', count: 1 },
      { name: 'Soup', count: 1 },
    ];
  }

  getAll(): Observable<Food[]> {
    return this.http.get<any[]>(this.FOODS_API_URL, { headers: this.getAuthHeaders() }).pipe(
      map(backendFoods => backendFoods.map(food => ({
        id: food.id,
        name: food.name,
        cookTime: food.cook_time,
        price: parseFloat(food.price),
        favorite: food.is_favorite,
        origins: food.origins,
        stars: parseFloat(food.stars),
        imageUrl: food.image_url,
        tags: food.tags
      })))
    );
  }

  getAllFoodsBySearch(searchTerm: string): Observable<Food[]> {
    return this.http.get<any[]>(`${this.FOODS_API_URL}?searchTerm=${searchTerm}`, { headers: this.getAuthHeaders() }).pipe(
      map(backendFoods => backendFoods.map(food => ({
        id: food.id,
        name: food.name,
        cookTime: food.cook_time,
        price: parseFloat(food.price),
        favorite: food.is_favorite,
        origins: food.origins,
        stars: parseFloat(food.stars),
        imageUrl: food.image_url,
        tags: food.tags
      })))
    );
  }

  getAllFoodsByTag(tag: string): Observable<Food[]> {
    const url = tag === 'All' ? this.FOODS_API_URL : `${this.FOODS_API_URL}?tag=${tag}`;
    return this.http.get<any[]>(url, { headers: this.getAuthHeaders() }).pipe(
      map(backendFoods => backendFoods.map(food => ({
        id: food.id,
        name: food.name,
        cookTime: food.cook_time,
        price: parseFloat(food.price),
        favorite: food.is_favorite,
        origins: food.origins,
        stars: parseFloat(food.stars),
        imageUrl: food.image_url,
        tags: food.tags
      })))
    );
  }

  getFoodById(id: number): Observable<Food> {
    return this.http.get<any>(`${this.FOODS_API_URL}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      map(food => ({
        id: food.id,
        name: food.name,
        cookTime: food.cook_time,
        price: parseFloat(food.price),
        favorite: food.is_favorite,
        origins: food.origins,
        stars: parseFloat(food.stars),
        imageUrl: food.image_url,
        tags: food.tags
      }))
    );
  }
}
