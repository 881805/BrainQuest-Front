import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbChatModule, NbCardModule, NbStatusService } from '@nebular/theme';
import { FormBuilder, FormsModule, FormGroup } from '@angular/forms';  // <-- Add this import
import { IMessage } from '../../interfaces';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true, 
  imports: [NbChatModule, NbCardModule, CommonModule, FormsModule], // <-- Add FormsModule here
  providers: [NbStatusService]
})
export class DebateChatComponent {
  public fb: FormBuilder = inject(FormBuilder);
  @Input() messageForm!: FormGroup;
  @Output() callSaveMethod: EventEmitter<IMessage> = new EventEmitter<IMessage>();
  private authService: AuthService = inject(AuthService);
  public messages : IMessage[] = [];


  messageText: string = '';  //mensaje para enviar


  isReply(message: IMessage) {
    const user = this.authService.getUser();
    
    if (user && user.id === message.user.id) {
      return false;
    }
    
    return true;
  }




  callSave() {
    let message: IMessage = {
      id: 0,
      conversation: {id: 0},
      contentText: this.messageText,
      createdAt: new Date(),
      user: {id: this.authService.getUser()?.id ?? 0},
      isSent: true,
    }
  

      this.callSaveMethod.emit(message);
    }
  
  
  
  
  // sendMessage() {
  //   if (this.messageText.trim()) {
  //     this.messages.push({ : this.messageText, reply: true, date: new Date() });
  //     this.messageText = '';  // Clear input after sending
  //   }
  // }
}
