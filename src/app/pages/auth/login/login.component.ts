import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public loginError: string = '';
  @ViewChild('email') usernameModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;

  public loginForm = {
    email: '',
    password: '',
    rememberUser: false,
    rememberPassword: false,
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  public handleLogin(event: Event): void {
    event.preventDefault();

    if (!this.usernameModel.valid) {
      this.usernameModel.control.markAsTouched();
    }
    if (!this.passwordModel.valid) {
      this.passwordModel.control.markAsTouched();
    }

    if (this.usernameModel.valid && this.passwordModel.valid) {
      this.authService.login(this.loginForm).subscribe({
        next: () => {
          this.router.navigateByUrl('/app/dashboard'); 
        },
        error: (err: any) => {
          this.loginError = err.error?.description || 'Error during login'; 
        },
      });
    }
  }

  public handleGoogleLogin(): void {
    this.authService.loginWithGoogle(); 
  }
}