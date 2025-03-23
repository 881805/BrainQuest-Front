import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule 
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignUpComponent {
  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService // Inyecta el servicio
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registroForm.valid) {
      const userData = this.registroForm.value;
      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Usuario registrado correctamente', response);
          this.router.navigate(['/login']); // Redirige a la página de inicio de sesión
        },
        error: (error) => {
          console.error('Error al registrar el usuario', error);
          // Aquí puedes mostrar un mensaje de error al usuario
          alert('Error al registrar el usuario. Por favor, inténtalo de nuevo.');
        }
      });
    } else {
      this.registroForm.markAllAsTouched();
    }
  }
}