import { Component, inject, ViewChild } from '@angular/core';
import { GamesListComponent } from '../../components/games/game-list-component/games-list.component';
import { GamesService } from '../../services/game.service';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalService } from '../../services/modal.service';
import { IGame, IMessage } from '../../interfaces';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import { DebateChatComponent } from '../../components/chat/chat.component';
import { CommonModule } from '@angular/common';

import { effect } from '@angular/core';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-debates',
  standalone: true,
  imports: [
    GamesListComponent,
    PaginationComponent,
    ModalComponent,
    LoaderComponent,
    DebateChatComponent,
    CommonModule
  ],
  templateUrl: './debates.component.html',
  styleUrls: ['./debates.component.scss'],
})
export class DebatesComponent {

  public gamesService: GamesService = inject(GamesService);
  public modalService: ModalService = inject(ModalService);
  public authService: AuthService = inject(AuthService);
  public messageService: MessageService = inject(MessageService);
  private webSocket: WebSocket;
  
  @ViewChild('addOrdersModal') public addOrdersModal: any;
  @ViewChild(DebateChatComponent) chat!: DebateChatComponent;
  public fb: FormBuilder = inject(FormBuilder);
  orderForm = this.fb.group({
    id: [''],
    description: ['', Validators.required],
    total: ['', Validators.required],
  });



  public currentGame: IGame = {};

 

  saveMessage(message: IMessage){
    this.gamesService.sendMessage(this.currentGame.id ?? 1,message);
  }



  async playGame() {
    try {
      // Toggle chat visibility first, and then proceed to set messages
      await this.toggleChatVisibility();
      this.chat.messages = this.currentGame.conversation?.messages ?? [];
      this.gamesService.joinRoom(this.currentGame.id ?? 1);
    } catch (e) {
      console.error("Error in playGame:", e);
    }
  }

  // saveMessage(message: IMessage) {
   
  //   const messageToSend = {
  //     ...message, //copia mensaje en un nuevo objeto, el mandar un objeto complejo causa problemas en el backend
  //     conversation: { id: message.conversation?.id || 1 }, 
  //     user: { id: message.user?.id }, 
  //   };
    
  //   // Send the simplified message to the backend
  //   this.messageService.save(messageToSend);
  
  //   // Close any open modal
  //   this.modalService.closeAll();
  // }
  
  isComponentVisible: boolean = false;
  
  // Method to toggle visibility
  async toggleChatVisibility() {
    this.isComponentVisible = !this.isComponentVisible;
    return new Promise<void>(resolve => {
      setTimeout(resolve, 0); 
    });
  }

  
}
