import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-brainquest',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../../../styles.scss']
})
export class DashboardComponent {
  @ViewChild('scrollContainer', { read: ElementRef }) scrollContainer!: ElementRef;

  services = [
    { title: 'Trivia', image: 'ejemplo de actividad', description: 'Description of service 1' },
    { title: 'Entrevista', image: 'ejemplo de actividad', description: 'Description of service 2' },
    { title: 'Debate', image: 'ejemplo de actividad', description: 'Description of service 3' }
  ];

  testimonials = [
    { text: '"¡Me encanta esta plataforma! Los juegos de debate con IA son increíblemente divertidos y desafiantes. La IA es muy inteligente y siempre presenta argumentos sólidos, lo que me ha ayudado a mejorar mis habilidades de persuasión y pensamiento crítico. ¡Totalmente recomendado para amantes de la argumentación!"', name: 'Alina Torrente'},
    { text: '"Las trivias son mi parte favorita de esta página. La IA adapta las preguntas a mi nivel de conocimiento y siempre aprende de mis respuestas para hacerme mejorar. ¡Es adictivo y educativo al mismo tiempo!"', name: 'Isadora Montes' },
    { text: '"Las entrevistas simuladas con IA me ayudaron a prepararme para mi entrevista de trabajo real. La IA hizo preguntas desafiantes y me dio retroalimentación detallada sobre mis respuestas. ¡Gracias a esto, conseguí el trabajo que quería!"', name: 'Gabriel Quiroga' },   
    { text: '"Me encanta cómo puedo elegir trivias de diferentes temas, desde historia hasta cultura pop. La IA siempre encuentra preguntas interesantes y aprende de mis preferencias. ¡Nunca me aburro!"', name: 'Julián Navarro' },   
  ];

  activeIndex = 0;

  scrollLeft(): void {
    this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    this.activeIndex = (this.activeIndex - 1 + this.services.length) % this.services.length;
  }

  scrollRight(): void {
    this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    this.activeIndex = (this.activeIndex + 1) % this.services.length;
  }
}