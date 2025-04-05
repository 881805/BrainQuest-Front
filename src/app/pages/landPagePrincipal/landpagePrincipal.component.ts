import { Component, inject, OnInit } from "@angular/core";
import { ActivityCard, Challenge, ILoginResponse } from "../../interfaces";
import { CommonModule } from "@angular/common";
import { BookOpen, Headphones, HelpCircle, Keyboard, LucideAngularModule, MessageSquare, Users } from "lucide-angular";
import { MyAccountComponent } from "../../components/my-account/my-account.component";
import { TopbarComponent } from "../../components/app-layout/elements/topbar/topbar.component";
import { AppLayoutComponent } from "../../components/app-layout/app-layout.component";
import { RouterModule,Router, ActivatedRoute } from "@angular/router";
import { OAuthService } from "angular-oauth2-oidc";
import { AuthService } from "../../services/auth.service";
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-landpage-principal',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, MyAccountComponent, TopbarComponent, AppLayoutComponent, RouterModule, ],
    templateUrl: './landpagePrincipal.component.html',
    styleUrls: ['./landpagePrincipal.component.scss']

})

export class  LandPagePrincipalComponent implements OnInit{
  public loginError: string = '';
  private authService = inject(AuthService);
  private http = inject(HttpClient);
   ngOnInit(): void {
    // Verifica si la URL tiene el código de autorización
    this.activatedRoute.queryParams.subscribe((params) => {
      const code = params['code'];
      if (code) {
        // Una vez que recibas el código de la URL, usa tryLogin() para obtener el token
        this.oauthService.tryLogin().then(async () => {
          const accessToken = this.oauthService.getAccessToken();
          const idToken = this.oauthService.getIdToken();

          console.log('Access Token:', accessToken);
          console.log('ID Token:', idToken);

          let respondes = await this.generateJWTToken(accessToken);

          // Puedes almacenar estos tokens o hacer lo que necesites con ellos
        }).catch(error => {
          console.error('Error al obtener el token:', error);
        });
      }
    });
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
            icon: MessageSquare,
            title: 'Debate',
            description: 'Aquí podrás debatir contra otras personas, midiendo tus habilidades de argumentación y retórica.',
            buttonColor: "#F2622E",
            iconBgColor: "#94F2F2"
        },
        {
            icon: { name: "keyboard" },
            title: 'Typing',
            description: 'Mejora tu velocidad y precision de escritura.',
            buttonColor: "#80A2A6",
            iconBgColor: "#94F2F2"
        },
        {
            icon: { name: "headphones" },
            title: 'Entrevista',
            description: 'Parctica entrevistas con expertos en diferentes áreas.',
            buttonColor: "#F2622E",
            iconBgColor: "#94F2F2"
        },
        {
            icon: { name: "book-open" },
            title: 'Creación de Cuentos',
            description: 'Desarrolla tu creatividad escribiendo historias.',
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
            icon: { name: "users" },
            title: 'Comunidad',
            description: "Conecta con otros estudiantes y comparte experiencias.",
            buttonColor: "#80A2A6",
            iconBgColor: "#94F2F2"
        }
    ];

    challenges: Challenge[] = [
        {
            title: "Debate: Tecnología y Educación",
            description: "Participa en un debate estructurado sobre cómo la tecnología está transformando la educación.",
            level: "Nivel 1",
            duration: "45 min",
            participantsOrRecord: "Participantes: 8",
            buttonColor: "#F2622E",
            buttonText: "Jugar"
        },
        {
            title: "Typing: Velocidad Básica",
            description: "Mejora tu velocidad de escritura con ejercicios prácticos y medición de tiempo.",
            level: "Nivel 2",
            duration: "20 min",
            participantsOrRecord: "Récord: 65 PPM",
            buttonColor: "#80A2A6",
            buttonText: "Jugar"
          },
          {
            title: "Trivia: Cultura General",
            description: "Pon a prueba tus conocimientos con preguntas de cultura general de diversos temas.",
            level: "Nivel 1",
            duration: "15 min",
            participantsOrRecord: "Preguntas: 20",
            buttonColor: "#F2622E",
            buttonText: "Jugar"
          }
        ];
        goToActivity(activity: ActivityCard) {
            switch (activity.title) {
              case 'Debate':
                this.router.navigate(['/app/debates']);
                break;
              case 'Typing':
                this.router.navigate(['/app/typing']);
                break;
              case 'Entrevista':
                this.router.navigate(['/interview']);
                break;
              // etc.
              default:
                console.warn('Ruta no definida para esta actividad');
            }
          }


  constructor(
  private activatedRoute: ActivatedRoute,   // Primero ActivatedRoute
  private oauthService: OAuthService,        // Luego OAuthService
  private router: Router                     // Luego Router
) {}
}