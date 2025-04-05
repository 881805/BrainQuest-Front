import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthGoogleService } from '../../../services/auth-google.service';
import { OAuthModule } from 'angular-oauth2-oidc';

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
  private authService = inject(AuthGoogleService);

  signInWithGoogle() {
    this.authService.login();
  }

  public loginForm = {
    email: '',
    password: '',
    rememberUser: false,
    rememberPassword: false,
  };

  constructor(
    private router: Router,
  ) {}

  public handleLogin(event: Event): void {
    event.preventDefault();

    if (!this.usernameModel.valid) {
      this.usernameModel.control.markAsTouched();
    }
    if (!this.passwordModel.valid) {
      this.passwordModel.control.markAsTouched();
    }
  }
}