import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './ladingpage.component.html',
  styleUrls: ['./styles.component.scss'],
})
export class LandingPageComponent {
  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/auth/login']);
  }

  navigateToSignUp() {
    this.router.navigate(['/auth/signup']);
  }
}