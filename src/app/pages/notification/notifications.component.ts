import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { INotification } from '../../interfaces';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../components/loader/loader.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    PaginationComponent,
    ModalComponent,
    ReactiveFormsModule
  ]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: INotification[] = [];
  subscription = new Subscription();
  userId: number = 1; 

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.notificationService.getUserNotifications(this.userId).subscribe(notifs => {
        this.notifications = notifs;
      })
    );

    this.subscription.add(
      this.notificationService.onNewNotification().subscribe(newNotif => {
        this.notifications.unshift(newNotif);
      })
    );
  }

  markAsRead(notification: INotification): void {
    this.notificationService.markAsRead(notification.id).subscribe(() => {
      notification.isRead = true;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
