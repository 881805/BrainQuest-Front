import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { AuthService } from './auth.service';
import { AlertService } from './alert.service';
import { IAiConfiguration, ISearch } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AiConfigurationService extends BaseService<IAiConfiguration> {
  protected override source: string = 'ai-configurations';  // La fuente de la API para AiConfiguration
  private aiConfigListSignal = signal<IAiConfiguration[]>([]);  // Signal para gestionar el estado local
  get aiConfigurations$() {
    return this.aiConfigListSignal;
  }

  public search: ISearch = { 
    page: 1,
    size: 5
  };
  public totalItems: any = [];
  
  private authService: AuthService = inject(AuthService);
  private alertService: AlertService = inject(AlertService);

  // Obtener todas las configuraciones
  getAll() {
    this.findAllWithParams({ page: this.search.page, size: this.search.size }).subscribe({
      next: (response: any) => {
        console.log('Response:', response);
        if (Array.isArray(response)) {
          this.aiConfigListSignal.set(response);  // Actualizar la lista de configuraciones
          this.search = { ...this.search, totalPages: 1 };
          const totalPages = this.search.totalPages ?? 0;
          this.totalItems = Array.from({ length: totalPages }, (_, i) => i + 1);
        } else {
          console.error('Invalid response format:', response);
        }
      },
      error: (err: any) => {
        console.error('Error:', err);
      }
    });
  }

  // Crear nueva configuración de IA
  save(configuracion: IAiConfiguration) {
    this.add(configuracion).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();  // Recargar las configuraciones
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred adding the AI configuration','center', 'top', ['error-snackbar']);
        console.error('Error:', err);
      }
    });
  }

  // Actualizar configuración de IA
  update(configuracion: IAiConfiguration) {
    this.editCustomSource(`${configuracion.id}`, configuracion).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();  // Recargar las configuraciones
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred updating the AI configuration','center', 'top', ['error-snackbar']);
        console.error('Error:', err);
      }
    });
  }

  // Eliminar configuración de IA
  delete(configuracion: IAiConfiguration) {
    this.delCustomSource(`${configuracion.id}`).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', 'AI configuration deleted successfully', 'center', 'top', ['success-snackbar']);
        this.getAll();  // Recargar las configuraciones
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred deleting the AI configuration','center', 'top', ['error-snackbar']);
        console.error('Error:', err);
      }
    });
  }

  // Lógica para obtener las configuraciones de IA asociadas a un usuario
  getConfigurationsByUser(userId: number) {
    this.getAll();  // Se puede implementar un filtro aquí si la API soporta
  }

  // Lógica para asociar la configuración seleccionada a un prompt de IA (ejemplo en el debate o entrevista)
  setConfigurationForPrompt(configuracionId: number) {
    // Aquí se podría gestionar la configuración en la IA
    console.log(`Configuración con ID: ${configuracionId} asociada al prompt de IA.`);
    // Este método puede interactuar con la API de IA para modificar el comportamiento de los prompts
  }
}
