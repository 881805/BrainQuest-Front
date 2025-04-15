import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbChatModule, NbCardModule, NbStatusService } from '@nebular/theme';
import { FormBuilder, FormsModule, FormGroup } from '@angular/forms';
import { IMessage } from '../../interfaces';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true, 
  imports: [NbChatModule, NbCardModule, CommonModule, FormsModule], 
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


