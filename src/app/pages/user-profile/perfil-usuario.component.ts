import { Component } from '@angular/core';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.scss']
})
export class PerfilUsuarioComponent {
  nombreUsuario = 'María González';

  publicaciones = [
    {
      tipo: 'logro',
      titulo: 'Logro Desbloqueado',
      descripcion: 'Completó el 100% de actividades del módulo 1',
      comentario: '¡Muy feliz de haberlo logrado!'
    },
    {
      tipo: 'texto',
      contenido: 'Hoy aprendí mucho sobre cómo mejorar mi memoria.'
    }
  ];

  editarPerfil() {
    alert(`Editar perfil de ${this.nombreUsuario}`);
  }
}