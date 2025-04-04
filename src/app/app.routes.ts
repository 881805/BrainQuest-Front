import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignUpComponent} from './pages/auth/sign-up/signup.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { UsersComponent } from './pages/users/users.component';
import { AuthGuard } from './guards/auth.guard';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { GuestGuard } from './guards/guest.guard';
import { IRoleType } from './interfaces';
import { ProfileComponent } from './pages/profile/profile.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { PreferenceListPageComponent } from './pages/preferenceList/preference-list.component';
import { TeamComponent } from './pages/landPageTeam/team.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { DebatesComponent } from './pages/debate/debates.component';


import { LandPageComponent } from './pages/landPage/landpage.component';
import { LandPagePrincipalComponent } from './pages/landPagePrincipal/landpagePrincipal.component';

import { OAuthService } from 'angular-oauth2-oidc';
import { LandPageComponent } from './pages/landPage/landpage.component';


import { TypingComponent } from './pages/typing/typing.component';
import { TriviaComponent } from './pages/trivia/trivia.component';
import { EstadisticasComponent } from './pages/estadisticas/estadisticas.component';
import { LogrosComponent } from './pages/logros/logros.component';
import { SignUpComponent } from './pages/auth/sign-up/signup.component';


export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
    providers: [OAuthService]
  },
  {
    path: 'signup',
    component: SignUpComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
  },
  {
    path: 'app/dashboard',
    component: LandPagePrincipalComponent,
  },
  {
    path: '',
    component: LandPageComponent,
  },
  {
    path: 'app/dashboard',
    component: DashboardComponent,
  },
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AdminRoleGuard],
        data: { 
          authorities: [IRoleType.admin, IRoleType.superAdmin],
          name: 'Users',
          showInSidebar: true,
        },
      },
      {
        path: 'dashboard',
        component: LandPagePrincipalComponent,
        data: { 
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Dashboard',
          showInSidebar: true,
        },
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { 
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Profile',

          showInSidebar: false,
        },
      },
      {
        path: 'debates',
        component: DebatesComponent,
        data: { 

          authorities: [
            IRoleType.admin, 
            IRoleType.superAdmin,
            IRoleType.user
          ],
          name: 'debates',
          showInSidebar: true
        }

          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Games',

          showInSidebar: true,
        },
      },
      {
        path: 'orders',
        component: OrdersComponent,
        data: { 
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Orders',

          showInSidebar: true,
        },

      },
      {
        path: 'preference-list',
        component: PreferenceListPageComponent,
        data: { 
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Preference List',

          showInSidebar: true,
        },
      },
      {
        path: 'typing',
        component: TypingComponent,
        data: { 
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Typing',
          showInSidebar: true
        }
      },
      {
        path: 'trivia',
        component: TriviaComponent,
        data: { 
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Trivia',
          showInSidebar: true
        }
      },
      {
        path: 'estadisticas',
        component: EstadisticasComponent,
        data: { 
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Estadísticas',
          showInSidebar: true
        }
      },
      {
        path: 'logros',
        component: LogrosComponent,
        data: { 
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Logros',
          showInSidebar: true
        }
      }
    ],
  },
  {
    path: 'team',
    component: TeamComponent,
  },
];