import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, FormGroup } from '@angular/forms';
import { IMessage } from '../../interfaces';
import { AuthService } from '../../services/auth.service';
import { NbChatModule, NbCardModule, NbStatusService } from '@nebular/theme';

@Component({
  selector: 'app-interview-chat',
  templateUrl: './chat-interview.html',
  styleUrls: ['./chat-interview.scss'],
  standalone: true,
  imports: [ 
    CommonModule, 
    FormsModule, 
    NbCardModule, 
    NbChatModule 
  ],
  providers: []
})
export class InterviewChatComponent {
  public fb: FormBuilder = inject(FormBuilder);
  @Input() messageForm!: FormGroup;
  @Output() callSaveMethod: EventEmitter<IMessage> = new EventEmitter<IMessage>();
  private authService: AuthService = inject(AuthService);
  @Input() messages = signal<IMessage[]>([]);

  messageText: string = '';

  constructor() {}
  isReply(message: IMessage) {
    const user = this.authService.getUser();
    
    if (user && user.id === message.user.id) {
      return false; 
    }
    
    return true; 
  }

  callSave() {
    let message: IMessage = {
      conversation: { id: 0 },
      contentText: this.messageText,
      createdAt: new Date(),
      user: { id: this.authService.getUser()?.id ?? 0 },
      isSent: true,
    };
    this.callSaveMethod.emit(message);
  }
}