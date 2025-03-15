import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
    selector: 'app-team',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.scss', '../../../styles.scss']
})

export class TeamComponent {
    teamMembers = [
        { name: 'Sebastián Chinchilla Arguedas', rol: 'Coordinador General', image: 'assets/img/warriors/guerrero 1.webp', description: 'Descripción del integrante 1' },
        { name: 'Malcom Quirós Madriz', rol: 'Coordinador de Desarrollo', image: 'assets/img/warriors/guerrero 2.webp', description: 'Descripción del integrante 2' },
        { name: 'Jose Mario Salazar Morera', rol: 'Coordinador de Calidad', image: 'assets/img/warriors/guerrero 3.webp', description: 'Descripción del integrante 3' },
        { name: 'Johnny Jesús Pérez Boza', rol: 'Coordinador de Soporte', image: 'assets/img/warriors/guerrero 4.webp', description: 'Descripción del integrante 4' },
    ];

    teamMission = "Nuestra misión es empoderar a las empresas y organizaciones mediante soluciones tecnológicas de vanguardia que impulsen su éxito " +
        "en un mundo digital en constante evolución. Nos dedicamos a transformar ideas en realidades digitales, ofreciendo aplicaciones " +
        "intuitivas, eficientes y confiables. Trabajamos en estrecha colaboración con nuestros clientes para entender sus necesidades y " +
        "superar sus expectativas, entregando productos de alta calidad a tiempo y dentro del presupuesto. Comprometidos con la innovación " +
        "y las mejores prácticas del sector, proporcionamos experiencias de usuario excepcionales que aseguran el crecimiento sostenible de " +
        "nuestros clientes en el ámbito digital.";

    teamVision = "Ser líderes globales en el desarrollo de aplicaciones tecnológicas innovadoras, reconocidos por nuestra creatividad, excelencia técnica" +
        "y compromiso con la satisfacción del cliente. Aspiramos a transformar la vida de las personas y mejorar la eficiencia de las empresas" +
        "mediante soluciones excepcionales que optimicen su presencia en el mundo digital. Buscamos construir un futuro donde las empresas de todos" +
        "los tamaños alcancen su máximo potencial, contribuyendo a un ecosistema tecnológico más eficiente, accesible y dinámico.";
}