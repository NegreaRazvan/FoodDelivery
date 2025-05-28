import {Food} from './Food';

export class CartItem {
  private _food:Food;
  private _quantity:number = 1;

  get food(): Food {
    return this._food;
  }

  set food(value: Food) {
    this._food = value;
  }

  get quantity(): number {
    return this._quantity;
  }

  set quantity(value: number) {
    this._quantity = value;
  }

  constructor(food:Food) {
    this._food = food;
  }

  get price(){
    return this._food.price*this._quantity;
  }
}
