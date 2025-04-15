import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
//import { AuthGoogleService } from '../../../services/auth-google.service';
import { AuthService } from '../../../services/auth.service';
import { OAuthModule } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';
import { ILoginResponse } from '../../../interfaces';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, OAuthModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public loginError: string = '';
  @ViewChild('username') usernameModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;

  //private authGoogleService = inject(AuthGoogleService);
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private router = inject(Router);

  public loginForm = {
    email: '',
    password: '',
    rememberUser: false,
    rememberPassword: false,
  };

  constructor() {}

  public handleLogin(event: Event) {
    event.preventDefault();
    if (!this.usernameModel.valid) {
      this.usernameModel.control.markAsTouched();
    }
    if (!this.passwordModel.valid) {
      this.passwordModel.control.markAsTouched();
    }
    if (this.usernameModel.valid && this.passwordModel.valid) {
      this.authService.login(this.loginForm).subscribe({
        next: () => this.router.navigateByUrl('/app/dashboard'),
        error: (err: any) => (this.loginError = err.error.description),
      });
    }
  }
}
