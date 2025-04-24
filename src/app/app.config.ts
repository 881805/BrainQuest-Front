import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { baseUrlInterceptor } from './interceptors/base-url.interceptor';
import { accessTokenInterceptor } from './interceptors/access-token.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { Apple, ArrowRight, BookOpen, Headphones, HelpCircle, Keyboard, LucideAngularModule, MessageSquare, Users } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideOAuthClient(),
    provideRouter(routes), 
    provideClientHydration(),
    provideHttpClient(
      withInterceptors([
        baseUrlInterceptor,
        accessTokenInterceptor
        //handleErrorsInterceptor
      ])
    ), 
    provideAnimationsAsync(),

    importProvidersFrom(
      LucideAngularModule.pick({        
        MessageSquare,
        Keyboard,
        Headphones,
        BookOpen,
        HelpCircle,
        Users,
        ArrowRight,
      Apple})
    )
  ]
};
