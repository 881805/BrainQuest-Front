import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { AuthService } from './../../../services/auth.service';
import { IAiConfiguration } from '../../../interfaces';

@Component({
  selector: 'app-ai-configuration-list',
  standalone: true,
  imports: [],
  templateUrl: './ai-configuration-list.component.html',
  styleUrl: './ai-configuration-list.component.scss'
})
export class AiConfigurationListComponent {
  @Input() title: string = '';
  @Input() aiConfigurations: IAiConfiguration[] = [];
  @Output() callModalAction: EventEmitter<IAiConfiguration> = new EventEmitter<IAiConfiguration>();
  @Output() callDeleteAction: EventEmitter<IAiConfiguration> = new EventEmitter<IAiConfiguration>();
  
  public AuthService: AuthService = inject(AuthService);
}
