import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { AuthService } from '../../services/auth.service';
import { IAiConfiguration } from '../../interfaces';
import { ModalComponent } from '../../components/modal/modal.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { AiConfigurationListComponent } from '../../components/aiConfiguration/aiConfiguration-list/aiconfiguration-list.component';
import { AiConfigurationFormComponent } from '../../components/aiConfiguration/aiConfiguration-form/aiconfiguration-form.component';
import { AiConfigurationService } from '../../services/Ai-Configuration.Service';

@Component({
  selector: 'app-ai-configuration',
  standalone: true,
  imports: [
    AiConfigurationListComponent,
    AiConfigurationFormComponent,
    PaginationComponent,
    ModalComponent,
    LoaderComponent
  ],
  templateUrl: './ai-configuration.component.html',
  styleUrl: './ai-configuration.component.scss'
})
export class AiConfigurationComponent {
  public aiConfigurationService: AiConfigurationService = inject(AiConfigurationService);
  public modalService: ModalService = inject(ModalService);
  public authService: AuthService = inject(AuthService);
  public fb: FormBuilder = inject(FormBuilder);
  @ViewChild('addAiConfigurationModal') public addAiConfigurationModal: any;

  aiConfigurationForm = this.fb.group({
    id: [''],
    configuracion: ['', Validators.required]
  });

  constructor() {
    this.aiConfigurationService.search.page = 1;
    this.aiConfigurationService.getAll();
  }

  saveConfiguration(config: IAiConfiguration) {
    this.aiConfigurationService.save(config);
    this.modalService.closeAll();
  }

  callEdition(config: IAiConfiguration) {
    this.aiConfigurationForm.controls['id'].setValue(config.id !== undefined ? String(config.id) : '');
    this.aiConfigurationForm.controls['configuracion'].setValue(config.configuracion ?? '');
    this.modalService.displayModal('md', this.addAiConfigurationModal);
  }

  updateConfiguration(config: IAiConfiguration) {
    this.aiConfigurationService.update(config);
    this.modalService.closeAll();
  }
}
