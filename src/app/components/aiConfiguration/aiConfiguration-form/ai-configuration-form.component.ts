import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IAiConfiguration } from '../../../interfaces';

@Component({
  selector: 'app-ai-configuration-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './ai-configuration-form.component.html',
  styleUrl: './ai-configuration-form.component.scss'
})
export class AiConfigurationFormComponent {

  @Input() aiConfigurationForm!: FormGroup;
  @Output() callSaveMethod: EventEmitter<IAiConfiguration> = new EventEmitter<IAiConfiguration>();
  @Output() callUpdateMethod: EventEmitter<IAiConfiguration> = new EventEmitter<IAiConfiguration>();

  callSave() {
    const configuration: IAiConfiguration = {
      configuracion: this.aiConfigurationForm.controls['configuracion'].value,
    }

    if (this.aiConfigurationForm.controls['id'].value) {
      configuration.id = this.aiConfigurationForm.controls['id'].value;
    }

    if (configuration.id) {
      this.callUpdateMethod.emit(configuration);
    } else {
      this.callSaveMethod.emit(configuration);
    }
  }
}
