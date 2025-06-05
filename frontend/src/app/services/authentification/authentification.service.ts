import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {User} from '../../shared/Model/User';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  private loginUrl = 'http://localhost/OnlineRestaurant/login';
  private logoutUrl = 'http://localhost/OnlineRestaurant/logout';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('user');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login( credentials: {username: string, password: string} ) : Observable<any> {
    return this.http.post<any>(this.loginUrl, credentials).pipe(
      tap( response => {
        const user: User = {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
          address: response.user.address,
        }
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', response.access_token);
        localStorage.setItem('refreshToken', response.refresh_token);
        localStorage.setItem('accessTokenExpiresIn', (Date.now() + response.expires_in * 1000).toString())

        this.currentUserSubject.next(user);
        this.router.navigate(['/']);
      }
      )
    )
  }

  logout() : void {
    const refreshToken = localStorage.getItem('refreshToken');
    if(refreshToken ) {
      this.http.post(this.logoutUrl, {refresh_token: refreshToken}).subscribe({
          next: () => {
            this.clearSession();
          },
          error: (e) => {
            console.error("Logout Failed");
            this.clearSession();
          }
        }
      )
    } else {
      this.clearSession();
    }
  }


  private clearSession() {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessTokenExpiresIn');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login-page']);
  }
}
