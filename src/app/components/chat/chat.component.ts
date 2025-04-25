import { Component, ElementRef, EventEmitter, inject, Input, Output, signal, ViewChild } from '@angular/core';
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
  private authService: AuthService = inject(AuthService);
  @ViewChild('textAreaBox') myInput!: ElementRef;
  @Input() messageForm!: FormGroup;
  @Output() callSaveMethod: EventEmitter<IMessage> = new EventEmitter<IMessage>();
  @Input() messages = signal<IMessage[]>([]);
  @Output() restartEvent = new EventEmitter<void>();

  messageText: string = '';
  debateFinished = false;

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
      this.debateFinished = true;
      (this.myInput.nativeElement as HTMLTextAreaElement).disabled = true;
      (this.myInput.nativeElement as HTMLTextAreaElement).placeholder = 'Debate finalizado.';
    }

    this.messageText = '';
  }

  adjustTextareaHeight(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  restartDebate() {
    this.debateFinished = false;
    this.clearMessages();
    this.messageText = '';
    this.restartEvent.emit();
    (this.myInput.nativeElement as HTMLTextAreaElement).disabled = false;
    (this.myInput.nativeElement as HTMLTextAreaElement).placeholder = 'Escribe sobre lo que quieras debatir...';
  }

  isDebateOver(): boolean {
    return this.messages().length >= 6;
  }

  clearMessages() {
    this.messages.set([]);
  }
}
