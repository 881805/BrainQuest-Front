import { AfterViewInit, Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { IAiConfiguration } from '../../../interfaces';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai-configuration-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './aiconfiguration-list.component.html',
  styleUrls: ['./aiconfiguration-list.component.scss']
})
export class AiConfigurationListComponent {
  public AuthService: AuthService = inject(AuthService);
  @Input() title: string = '';
  @Input() aiConfigurations: IAiConfiguration[] = [];
  @Output() callModalAction: EventEmitter<IAiConfiguration> = new EventEmitter<IAiConfiguration>();
  @Output() callDeleteAction: EventEmitter<IAiConfiguration> = new EventEmitter<IAiConfiguration>();

  trackById(index: number, item: IAiConfiguration): number {
    return item.id;
  }
}
