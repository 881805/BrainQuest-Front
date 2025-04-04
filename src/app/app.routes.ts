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
import { GamesComponent } from './pages/games/games.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { PreferenceListPageComponent } from './pages/preferenceList/preference-list.component';
import { TeamComponent } from './pages/landPageTeam/team.component';
import { LandPagePrincipalComponent } from './pages/landPagePrincipal/landpagePrincipal.component';
<<<<<<< Updated upstream
import { OAuthService } from 'angular-oauth2-oidc';
import { LandPageComponent } from './pages/landPage/landpage.component';
=======
>>>>>>> Stashed changes

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
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
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
        path: 'games',
        component: GamesComponent,
        data: { 
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
    ],
  },
  {
    path: 'team',
    component: TeamComponent,
  },
];