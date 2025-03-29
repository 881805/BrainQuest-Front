import { Component, inject, ViewChild } from '@angular/core';
import { GamesListComponent } from '../../components/games/game-list-component/games-list.component';
import { GamesService } from '../../services/game.service';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalService } from '../../services/modal.service';
import { IGame } from '../../interfaces';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DebateChatComponent } from '../../components/chat/chat.component';
import { CommonModule } from '@angular/common';

import { effect } from '@angular/core';

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
  @ViewChild('addOrdersModal') public addOrdersModal: any;
  @ViewChild(DebateChatComponent) chat!: DebateChatComponent;
  public fb: FormBuilder = inject(FormBuilder);
  orderForm = this.fb.group({
    id: [''],
    description: ['', Validators.required],
    total: ['', Validators.required],
  });



  public currentGame: IGame = {};

  constructor() {
    this.gamesService.getAllByUser();
  
    effect(() => {
      const games = this.gamesService.game$();
      this.currentGame = games.length > 0 ? games[0] : {} as IGame;
    });
  }

  async playGame() {
    try {
      // Toggle chat visibility first, and then proceed to set messages
      await this.toggleChatVisibility();
      this.chat.messages = this.currentGame.conversation?.messages ?? [];
    } catch (e) {
      console.error("Error in playGame:", e);
    }
  }
  
  isComponentVisible: boolean = false;
  
  // Method to toggle visibility
  async toggleChatVisibility() {
    this.isComponentVisible = !this.isComponentVisible;
    return new Promise<void>(resolve => {
      setTimeout(resolve, 0); 
    });
  }
  

    
//   saveOrder(order: IOrder) {
//     this.ordersService.save(order);
//     this.modalService.closeAll();
//   }

//   callEdition(order: IOrder) {
//     this.orderForm.controls['id'].setValue(order.id ? JSON.stringify(order.id) : '');
//     this.orderForm.controls['description'].setValue(order.description ? order.description : '');
//     this.orderForm.controls['total'].setValue(order.total ? JSON.stringify(order.total) : '');
//     this.modalService.displayModal('md', this.addOrdersModal);
//   }
  
//   updateOrder(order: IOrder) {
//     this.ordersService.update(order);
//     this.modalService.closeAll();
//   }
  
}
