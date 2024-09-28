import { Component, inject, OnInit } from '@angular/core';
import { ReservationService } from '../../../Services/reservation.service';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { ReservationModel } from '../reservation.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './historique.component.html',
  styleUrl: './historique.component.css'
})
export class HistoriqueComponent  implements OnInit{

  private reservationService = inject(ReservationService);
  private authService = inject(AuthService);
  private router = inject(Router);

  userId: number | null = null; // ID de l'utilisateur
  userReservations: ReservationModel[] = []; // Réservations de l'utilisateur

  ngOnInit(): void {
    const userIdString = localStorage.getItem('user_id');

    if (userIdString) {
      this.userId = Number(userIdString);
      this.loadUserReservations(this.userId);
    } else {
      alert('Vous devez être connecté pour voir l\'historique.');
      this.router.navigate(['/connexion']);
    }
  }

  loadUserReservations(userId: number) {
    this.reservationService.getUserReservations(userId).subscribe(
      (response) => {
        this.userReservations = response.reservations;
      },
      (error) => {
        console.error('Erreur lors du chargement des réservations', error);
        alert('Une erreur est survenue lors du chargement de vos réservations.'); // Alerte pour l'utilisateur
      }
    );
  }

  

}
