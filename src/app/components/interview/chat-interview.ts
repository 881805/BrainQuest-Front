import { Component, ElementRef, EventEmitter, inject, Input, Output, signal, ViewChild } from '@angular/core';
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
  providers: [NbStatusService]
})
export class InterviewChatComponent {
  public fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  @ViewChild('textAreaBox') myInput!: ElementRef;
  @Input() messageForm!: FormGroup;
  @Output() callSaveMethod: EventEmitter<IMessage> = new EventEmitter<IMessage>();
  @Input() messages = signal<IMessage[]>([]);
  @Output() restartEvent = new EventEmitter<void>();

  messageText: string = '';
  interviewFinished = false;

  constructor() {}
  isReply(message: IMessage): boolean {
    const user = this.authService.getUser();
    return !(user && user.id === message.user.id);
  }

  callSave() {
    if (!this.messageText.trim()) return;

    const message: IMessage = {
      conversation: { id: 0 },
      contentText: this.messageText,
      createdAt: new Date(),
      user: { id: this.authService.getUser()?.id ?? 0 },
      isSent: true,
    };

    this.callSaveMethod.emit(message);

    if (this.isDebateOver()) {
      this.interviewFinished = true;
      (this.myInput.nativeElement as HTMLTextAreaElement).disabled = true;
      (this.myInput.nativeElement as HTMLTextAreaElement).placeholder = 'Entrevista finalizada.';
    }

    this.messageText = '';
  }

  adjustTextareaHeight(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
  
  restartInterview() {
    this.interviewFinished = false;
    this.clearMessages();
    this.messageText = '';
    this.restartEvent.emit();
    (this.myInput.nativeElement as HTMLTextAreaElement).disabled = false;
    (this.myInput.nativeElement as HTMLTextAreaElement).placeholder = 'Escribe tu respuesta...';

  }

  isDebateOver(): boolean {
    let isOver = this.messages().length >= 4;
    return isOver;
  }

  clearMessages() {
    this.messages.set([]);
  }
}