import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NotifService } from '../Services/notif.service';

@Component({
  selector: 'app-notif',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notif.component.html',
  styleUrl: './notif.component.css'
})
export class NotifComponent {
  private notificationService = inject(NotifService)
  notifications: any[] = [];


  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getRecentNotifications().subscribe(
      (response: any) => {
        this.notifications = response.data; // Données formatées par le service
        console.log('Notifications:', this.notifications);
      },
      (error) => {
        console.error('Erreur lors de la récupération des notifications:', error);
      }
    );
  }
}
