import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IAiConfiguration } from '../../../interfaces';

@Component({
  selector: 'app-ai-configuration-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './aiconfiguration-form.component.html',
  styleUrls: ['./aiconfiguration-form.component.scss']
})
export class AiConfigurationFormComponent {
  public fb: FormBuilder = inject(FormBuilder);
  @Input() aiConfigurationForm!: FormGroup;
  @Output() callSaveMethod: EventEmitter<IAiConfiguration> = new EventEmitter<IAiConfiguration>();
  @Output() callUpdateMethod: EventEmitter<IAiConfiguration> = new EventEmitter<IAiConfiguration>();

  callSave() {
    let aiConfiguration: IAiConfiguration = {
      configuracion: this.aiConfigurationForm.controls['configuracion'].value,
      id: this.aiConfigurationForm.controls['id']?.value || null,
      createdAt: this.aiConfigurationForm.controls['createdAt']?.value || new Date()
    };
    if (this.aiConfigurationForm.controls['id'].value) {
      aiConfiguration.id = this.aiConfigurationForm.controls['id'].value;
    }
    if (aiConfiguration.id) {
      this.callUpdateMethod.emit(aiConfiguration);
    } else {
      this.callSaveMethod.emit(aiConfiguration);
    }
  }
}
