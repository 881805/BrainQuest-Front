import { Component, inject, OnInit } from "@angular/core";
import { ActivityCard, Challenge, ILoginResponse } from "../../interfaces";
import { CommonModule } from "@angular/common";
import { BookOpen, Headphones, HelpCircle, Keyboard, Apple, LucideAngularModule, MessageSquare, Users, Home, AlarmClock, FolderOpen } from "lucide-angular";
import { MyAccountComponent } from "../../components/my-account/my-account.component";
import { TopbarComponent } from "../../components/app-layout/elements/topbar/topbar.component";
import { AppLayoutComponent } from "../../components/app-layout/app-layout.component";
import { RouterModule,Router, ActivatedRoute } from "@angular/router";
import { OAuthService } from "angular-oauth2-oidc";
import { AuthService } from "../../services/auth.service";
import { HttpClient } from '@angular/common/http';
import { DailyMissionService } from "../../services/daily-missions.service";


@Component({
    selector: 'app-landpage-principal',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, MyAccountComponent, TopbarComponent, AppLayoutComponent, RouterModule,   ]
    ,
    templateUrl: './landpagePrincipal.component.html',
    styleUrls: ['./landpagePrincipal.component.scss']

})

export class  LandPagePrincipalComponent implements OnInit{
  public loginError: string = '';
  private authService = inject(AuthService);
  private dailyMissionService = inject(DailyMissionService);
  private http = inject(HttpClient);
   ngOnInit(): void {

    const hasAccessToMissions = this.authService.hasRoles('ROLE_ADMIN', 'ROLE_SUPER_ADMIN');

    this.activities = this.activities.filter(activity => {
      if (activity.title === 'Misiones') {
        return hasAccessToMissions;
      }
      return true;
    });
    
   
    this.activatedRoute.queryParams.subscribe((params) => {
      const code = params['code'];
      if (code) {

        this.oauthService.tryLogin().then(async () => {
          const accessToken = this.oauthService.getAccessToken();
          const idToken = this.oauthService.getIdToken();

          console.log('Access Token:', accessToken);
          console.log('ID Token:', idToken);

          let respondes = await this.generateJWTToken(accessToken);


        }).catch(error => {
          console.error('Error al obtener el token:', error);
        });
      }
    });
     
    this.dailyMissionService.assignMissions();
  }

  async generateJWTToken(googleToken: string){
   if (!googleToken) {
         this.loginError = 'No se obtuvo token de Google';
         return;
       }
   

       const response = await this.http
         .post<ILoginResponse>('http://localhost:8080/auth/google-login', { token: googleToken })
         .toPromise();
   
       if (response) {

         this.authService.saveLogin(response);

       }
  }
  username = "Estudiante";
  
  activities: ActivityCard[] = [
      {
          icon:  { name: "MessageSquare" },
          title: 'Debate',
          description: 'Aquí podrás debatir contra otras personas, midiendo tus habilidades de argumentación y retórica.',
          buttonColor: "#F2622E",
          iconBgColor: "#94F2F2"
      },
      {
        icon:  { name: "Apple" },
        title: 'Interview',
        description: 'Aquí podrás practicar entrevistas simuladas con IA y mejorar tus respuestas.',
        buttonColor: "#80A2A6",
        iconBgColor: "#94F2F2"
      },
      {
        icon:  { name: "MessageSquare" },
        title: 'Misiones',
        description: 'Aquí podrás configurar las misiones para los usuarios.',
        buttonColor: "#F2622E",
        iconBgColor: "#94F2F2"
    },
      {
          icon: { name: "keyboard" },
          title: 'Typing',
          description: 'Mejora tu velocidad y precision de escritura.',
          buttonColor: "#F2622E",
          iconBgColor: "#94F2F2"
      },
      {
        icon: { name: "keyboard" },
        title: 'Misiones Disponibles',
        description: 'Conoce cuales son los desafios disponibles',
        buttonColor: "#80A2A6",
        iconBgColor: "#94F2F2"
    },
      {
          icon: { name: "help-circle" },
          title: 'Trivia',
          description: 'Pon a prueba tus habilidades con preguntas desafiantes.',
          buttonColor: "#F2622E",
          iconBgColor: "#94F2F2"
      },
      {
        icon: { name: "help-circle" },
        title: 'Configuración de IA',
        description: 'Personaliza el comportamiento de la inteligencia artificial a tu manera.',
        buttonColor: "#F2622E",
        iconBgColor: "#94F2F2"
    },
    {
      icon: { name: "help-circle" },
      title: 'Aprendizaje Progresivo',
      description: 'Domina conceptos con desafíos que evolucionan contigo.',
      buttonColor: "#80A2A6",
      iconBgColor: "#94F2F2"
  },
  {
          icon: { name: "help-circle" },
          title: 'Historial',
          description: 'Revisa en cuales actividades has participado.',
          buttonColor: "#F2622E",
          iconBgColor: "#94F2F2"
      }

  ];

  goToActivity(activity: ActivityCard) {
      switch (activity.title) {
        case 'Debate':
          this.router.navigate(['/app/debates']);
          break;
        case 'Interview':
          this.router.navigate(['/app/interview']);
          break;
        case 'Misiones':
          this.router.navigate(['/app/missions']);
          break;
        case 'Typing':
          this.router.navigate(['/app/typing']);
          break;
        case 'Entrevista':
          this.router.navigate(['/interview']);
          break;
        case 'Trivia':
            this.router.navigate(['/app/trivia']);
            break;
        case 'Misiones Disponibles':
            this.router.navigate(['/app/dailymissions']);
            break;
        case 'Configuración de IA':
          this.router.navigate(['/app/ai-configuration']);
          break;
        case 'Aprendizaje Progresivo':
          this.router.navigate(['/app/learning-scenario']);
          break;
        // etc.

        case 'Historial':
          this.router.navigate(['/app/history']);
          break;

        default:
          console.warn('Ruta no definida para esta actividad');
      }
    }


  constructor(
  private activatedRoute: ActivatedRoute,   
  private oauthService: OAuthService,      
  private router: Router                     
) {}
}