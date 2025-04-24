// src/app/services/confetti.service.ts
import { Injectable } from '@angular/core';
import confetti from 'canvas-confetti';

@Injectable({
  providedIn: 'root',
})
export class ConfettiService {
  celebrate(duration: number = 5000) {
    
    confetti({
      particleCount: 300,
      spread: 160,
      origin: { y: 0.6 },
    });

    setTimeout(() => confetti.reset(), duration);
  }
}
