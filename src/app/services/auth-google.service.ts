import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  private oAuthService = inject(OAuthService);
  private router = inject(Router);
  profile = signal<any>(null);

  constructor() {
    this.initConfiguration();
  }

  async initConfiguration() {
    this.oAuthService.configure(authConfig);
  
    const manualDiscoveryDoc = {
      issuer: 'https://accounts.google.com',
      authorization_endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      token_endpoint: 'https://oauth2.googleapis.com/token',
      userinfo_endpoint: 'https://openidconnect.googleapis.com/v1/userinfo',
      revocation_endpoint: 'https://oauth2.googleapis.com/revoke',
      jwks_uri: 'https://www.googleapis.com/oauth2/v3/certs',
    };
  
    try {
      await this.oAuthService.loadDiscoveryDocument();
      await this.oAuthService.tryLoginCodeFlow();
  
      if (this.oAuthService.hasValidIdToken()) {
        this.profile.set(this.oAuthService.getIdentityClaims());
      }
  
      this.oAuthService.setupAutomaticSilentRefresh();
    } catch (error) {
      console.error('Authentication error:', error);
    }
  }
  async login() {
    this.oAuthService.initLoginFlow();
  }

  logout() {
    this.oAuthService.revokeTokenAndLogout().then(() => {
      this.oAuthService.logOut();
      this.profile.set(null);
      this.router.navigate(['/']);
    });
  }

  getProfile() {
    return this.profile();
  }

  getToken() {
    return this.oAuthService.getAccessToken();
  }

  isAuthenticated(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }
}