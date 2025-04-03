import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [CommonModule,
        RouterModule
    ],
    templateUrl: './landpage.component.html',
    styleUrls: ['./landpage.component.scss']
})
export class LandPageComponent implements OnInit {
    isNavbarActive: boolean = false;
    @ViewChild('scrollContainer', { read: ElementRef }) scrollContainer!: ElementRef;

    testimonials = [
        { text: '"¡Me encanta esta plataforma! Los juegos de debate con IA son increíblemente divertidos y desafiantes. La IA es muy inteligente y siempre presenta argumentos sólidos, lo que me ha ayudado a mejorar mis habilidades de persuasión y pensamiento crítico. ¡Totalmente recomendado para amantes de la argumentación!"', name: 'Alina Torrente' },
        { text: '"Las trivias son mi parte favorita de esta página. La IA adapta las preguntas a mi nivel de conocimiento y siempre aprende de mis respuestas para hacerme mejorar. ¡Es adictivo y educativo al mismo tiempo!"', name: 'Isadora Montes' },
        { text: '"Las entrevistas simuladas con IA me ayudaron a prepararme para mi entrevista de trabajo real. La IA hizo preguntas desafiantes y me dio retroalimentación detallada sobre mis respuestas. ¡Gracias a esto, conseguí el trabajo que quería!"', name: 'Gabriel Quiroga' },
        { text: '"Me encanta cómo puedo elegir trivias de diferentes temas, desde historia hasta cultura pop. La IA siempre encuentra preguntas interesantes y aprende de mis preferencias. ¡Nunca me aburro!"', name: 'Julián Navarro' },
    ];

    constructor() {}

    toggleNavbar(): void {
        this.isNavbarActive = !this.isNavbarActive;
    }

    ngOnInit(): void {
        this.setupScrollAnimations();
    }

    setupScrollAnimations(): void {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        });

        document.querySelectorAll('.animate-on-scroll').forEach((element) => {
            observer.observe(element);
        });
    }

    scrollTestimonials(direction: number): void {
        const scrollAmount = this.scrollContainer.nativeElement.clientWidth * direction;
        this.scrollContainer.nativeElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}