import { Component, inject, ViewChild } from '@angular/core';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { AiConfigurationService } from '../../services/Ai-Configuration.Service';
import { ModalService } from '../../services/modal.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IAiConfiguration } from '../../interfaces';
import { AiConfigurationFormComponent } from '../../components/aiConfiguration/aiConfiguration-form/ai-configuration-form.component';
import { CommonModule } from '@angular/common';
import { AiConfigurationListComponent } from '../../components/aiConfiguration/aiConfiguration-list/ai-configuration-list.component';
import { NbCardModule } from '@nebular/theme';

@Component({
  selector: 'ai-configuration',
  standalone: true,
  imports: [
    NbCardModule,
    AiConfigurationFormComponent,
    PaginationComponent,
    ModalComponent,
    LoaderComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AiConfigurationListComponent
  ],
  templateUrl: './ai-configuration.component.html',
  styleUrl: './ai-configuration.component.scss'
})
export class AiConfigComponent {
    public aiConfigurationService: AiConfigurationService = inject(AiConfigurationService);
    public modalService: ModalService = inject(ModalService);
    public authService: AuthService = inject(AuthService);
    public fb: FormBuilder = inject(FormBuilder);
    
    @ViewChild('addConfigurationsModal') public addConfigurationsModal: any;
  
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
      this.aiConfigurationForm.reset();
    }
  
    updateConfiguration(config: IAiConfiguration) {
      this.aiConfigurationService.update(config);
      this.modalService.closeAll();
      this.aiConfigurationForm.reset();
    }
  
    callEdition(config: IAiConfiguration) {
      this.aiConfigurationForm.controls['id'].setValue(config.id ? String(config.id) : '');
      this.aiConfigurationForm.controls['configuracion'].setValue(config.configuracion || '');
      this.modalService.displayModal('md', this.addConfigurationsModal);
    }
  }
  