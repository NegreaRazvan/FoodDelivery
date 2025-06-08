import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {Order} from '../../shared/Model/Order';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private currentOrderSubject: BehaviorSubject<Order | null>;
  public currentOrder: Observable<Order | null>;
  private ORDER_URL = 'http://localhost/OnlineRestaurant/orders';

  constructor(private http: HttpClient) {
    this.currentOrderSubject = new BehaviorSubject<Order | null>(null);
    this.currentOrder = this.currentOrderSubject.asObservable();
  }

  public get currentOrderValue(): Order | null {
    return this.currentOrderSubject.value;
  }

  save(order: Order): Observable<any> {
    return this.http.post<any>(this.ORDER_URL, {total_price: order.totalPrice, customer_name: order.name, customer_email: order.email, customer_address: order.address}).pipe(
      tap( response => {
          const order : Order ={
            id: response.order.id,
            totalPrice: response.order.totalPrice,
            name: response.order.name,
            email: response.order.email,
            address: response.order.address,
            createdAt: response.order.createdAt,
            updatedAt: response.order.updatedAt,
            status: response.order.status,
            items: [],
            paymentID: '',
          }

        this.currentOrderSubject.next(order);
        }
      )
    )
  }
}
