import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {Order} from '../../shared/Model/Order';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private CREATE_ORDER_URL = 'http://localhost/OnlineRestaurant/order';
  constructor(private http: HttpClient) { }

  save(order: Order): Observable<Order> {
    console.log({total_price: order.totalPrice, name: order.name, email: order.email, address: order.address});
    return this.http.post<any>(this.CREATE_ORDER_URL, {total_price: order.totalPrice, customer_name: order.name, customer_email: order.email, customer_address: order.address}).pipe(
      tap( response => {
          console.log(response);
        }
      )
    )
  }
}
