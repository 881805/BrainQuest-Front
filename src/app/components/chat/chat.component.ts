import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, FormGroup } from '@angular/forms';
import { IMessage } from '../../interfaces';
import { AuthService } from '../../services/auth.service';
import { NbCardModule, NbChatModule, NbStatusService } from '@nebular/theme';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true, 
  imports: [ 
    CommonModule, 
    FormsModule, 
    NbCardModule,
    NbChatModule,
  ], 
  providers: [NbStatusService]
})
export class DebateChatComponent {
  public fb: FormBuilder = inject(FormBuilder);
  @Input() messageForm!: FormGroup;
  @Output() callSaveMethod: EventEmitter<IMessage> = new EventEmitter<IMessage>();
  private authService: AuthService = inject(AuthService);
  @Input() messages  = signal<IMessage[]>([]);

  messageText: string = '';  

  constructor(){}
  isReply(message: IMessage) {
    const user = this.authService.getUser();
    
    if (user && user.id === message.user.id) {
      return false;
    }
    
    return true;
  }

  callSave() {
    let message: IMessage = {
      conversation: {id: 0},
      contentText: this.messageText,
      createdAt: new Date(),
      user: {id: this.authService.getUser()?.id ?? 0},
      isSent: true,
    }
      this.callSaveMethod.emit(message);
    }
}


