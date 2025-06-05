import {CartItem} from './CartItem';

export class Order {
  private _id!:number;
  private _items!: CartItem[];
  private _totalPrice!: number;
  private _name!: string;
  private _email!: string;
  private _address!:string;
  private _paymentID!: string;
  private _createdAt!:string;
  private _status!: string;


  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get items(): CartItem[] {
    return this._items;
  }

  set items(value: CartItem[]) {
    this._items = value;
  }

  get totalPrice(): number {
    return this._totalPrice;
  }

  set totalPrice(value: number) {
    this._totalPrice = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get address(): string {
    return this._address;
  }

  set address(value: string) {
    this._address = value;
  }

  get paymentID(): string {
    return this._paymentID;
  }

  set paymentID(value: string) {
    this._paymentID = value;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  set createdAt(value: string) {
    this._createdAt = value;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }
}
