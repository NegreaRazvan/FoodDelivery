import {CartItem} from './CartItem';

export class Cart{
  private _items:CartItem[] = [];


  get items(): CartItem[] {
    return this._items;
  }

  set items(value: CartItem[]) {
    this._items = value;
  }

  get totalPrice(): number{
    let totalPrice = 0;
    this.items.forEach(item => {
      totalPrice += item.price;
    })

    return totalPrice;
  }

}
