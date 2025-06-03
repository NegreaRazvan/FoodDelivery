import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthentificationService} from '../services/authentification/authentification.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login-page',
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  username: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthentificationService) {
  }

  handleLogin() {
    this.errorMessage = null;
    this.authService.login({username: this.username, password: this.password}).subscribe({
        next: () => {
          console.log('Login successfully');
        },
        error: (err) => {
          console.error('Login failed');
          this.errorMessage = err.error?.error || 'Login failed. Please try again.';
        }
      }
    )
  }
}
