import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { UsersComponent } from './pages/users/users.component';
import { AuthGuard } from './guards/auth.guard';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { GuestGuard } from './guards/guest.guard';
import { IRoleType } from './interfaces';
import { ProfileComponent } from './pages/profile/profile.component';
import { DebatesComponent } from './pages/debate/debates.component';
import { LandPageComponent } from './pages/landPage/landpage.component';
import { LandPagePrincipalComponent } from './pages/landPagePrincipal/landpagePrincipal.component';
import { OAuthService } from 'angular-oauth2-oidc';
import { TypingComponent } from './pages/typing/typing.component';
import { TriviaComponent } from './pages/trivia/trivia.component';
import { EstadisticasComponent } from './pages/estadisticas/estadisticas.component';
import { LogrosComponent } from './pages/logros/logros.component';
import { SignUpComponent } from './pages/auth/sign-up/signup.component';
import { IndexComponent } from './pages/members/index/index.component';
import { AboutComponent } from './pages/members/about/about.component';
import { ContactComponent } from './pages/members/contact/contact.component';
import { ProductosComponent } from './pages/members/productos/productos.component';
import { MissionsComponent } from './pages/mission/missions.component';
import { DailyMissionsComponent } from './pages/daily-missions/daily-missions.component';
import { EntrevistadorComponent } from './pages/interview/interviews.component';
import { AiConfigComponent } from './pages/ai-configuration/ai-configuration.component';
import { LearningScenarioComponent } from './pages/learningScenario/learning-scenario.component';

export const routes: Routes = [
  {
    path: 'app/dashboard',  
    component: LandPagePrincipalComponent, 
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
    providers: [OAuthService],
  },
  { path: 'index',
    component: IndexComponent,
  },
  { path: 'about',
    component: AboutComponent,
  },
  { path: 'contact',
    component: ContactComponent,
  },
  { path: 'productos',
    component: ProductosComponent,
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
    path: '',
    component: LandPageComponent,
  },
  {
    path: 'team',
    component: IndexComponent,
  },
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
  
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
        path: 'missions',
        component: MissionsComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin],
          name: 'Misiones',
          showInSidebar: true,
        },
      },
      {
        path: 'dailymissions',
        component: DailyMissionsComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Misiones Disponibles',
          showInSidebar: true,
        },
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
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Debates',
          showInSidebar: true,
        },
      },
      {
        path: 'interview',
        component: EntrevistadorComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Interview',
          showInSidebar: true,
        },
      },

      {
        path: 'typing',
        component: TypingComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Typing',
          showInSidebar: true,
        },
      },
      {
        path: 'trivia',
        component: TriviaComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Trivia',
          showInSidebar: true,
        },
      },
      {
        path: 'estadisticas',
        component: EstadisticasComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Estadísticas',
          showInSidebar: true,
        },
      },
      {
        path: 'logros',
        component: LogrosComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Logros',
          showInSidebar: true,
        },
      },
      {
        path: 'ai-configuration',
        component: AiConfigComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'ai-configuration',
          showInSidebar: true,
        },
      },
      {
        path: 'learning-scenario',
        component: LearningScenarioComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Trivia',
          showInSidebar: true,
        },
      },
    ],
  },
];
