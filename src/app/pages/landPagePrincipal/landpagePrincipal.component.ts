import { Component } from "@angular/core";
import { ActivityCard, Challenge } from "../../interfaces";
import { CommonModule } from "@angular/common";
import { BookOpen, Headphones, HelpCircle, Keyboard, LucideAngularModule, MessageSquare, Users } from "lucide-angular";
<<<<<<< Updated upstream
import { MyAccountComponent } from "../../components/my-account/my-account.component";
import { TopbarComponent } from "../../components/app-layout/elements/topbar/topbar.component";
import { AppLayoutComponent } from "../../components/app-layout/app-layout.component";
import { RouterModule } from "@angular/router";
=======
>>>>>>> Stashed changes


@Component({
    selector: 'app-landpage-principal',
    standalone: true,
<<<<<<< Updated upstream
    imports: [CommonModule, LucideAngularModule, MyAccountComponent, TopbarComponent, AppLayoutComponent, RouterModule],
=======
    imports: [CommonModule, LucideAngularModule],
>>>>>>> Stashed changes
    templateUrl: './landpagePrincipal.component.html',
    styleUrls: ['./landpagePrincipal.component.scss']
})
export class LandPagePrincipalComponent {
    username = "Estudiante";

<<<<<<< Updated upstream
    activities: ActivityCard[] = [  
        {
            icon: { name: "message-square" },
=======
    activities: ActivityCard[] = [
        {
            icon: MessageSquare,
>>>>>>> Stashed changes
            title: 'Debate',
            description: 'Aquí podrás debatir contra otras personas, midiendo tus habilidades de argumentación y retórica.',
            buttonColor: "#F2622E",
            iconBgColor: "#94F2F2"
        },
        {
<<<<<<< Updated upstream
            icon: { name: "keyboard" },
=======
            icon: Keyboard,
>>>>>>> Stashed changes
            title: 'Typing',
            description: 'Mejora tu velocidad y precision de escritura.',
            buttonColor: "#80A2A6",
            iconBgColor: "#94F2F2"
        },
        {
<<<<<<< Updated upstream
            icon: { name: "headphones" },
=======
            icon: Headphones,
>>>>>>> Stashed changes
            title: 'Entrevista',
            description: 'Parctica entrevistas con expertos en diferentes áreas.',
            buttonColor: "#F2622E",
            iconBgColor: "#94F2F2"
        },
        {
<<<<<<< Updated upstream
            icon: { name: "book-open" },
=======
            icon: BookOpen,
>>>>>>> Stashed changes
            title: 'Creación de Cuentos',
            description: 'Desarrolla tu creatividad escribiendo historias.',
            buttonColor: "#80A2A6",
            iconBgColor: "#94F2F2"
        },
        {
<<<<<<< Updated upstream
            icon: { name: "help-circle" },
=======
            icon: HelpCircle,
>>>>>>> Stashed changes
            title: 'Trivia',
            description: 'Pon a prueba tus habilidades con preguntas desafiantes.',
            buttonColor: "#F2622E",
            iconBgColor: "#94F2F2"
        },
        {
<<<<<<< Updated upstream
            icon: { name: "users" },
=======
            icon: Users,
>>>>>>> Stashed changes
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

        constructor() {}
}