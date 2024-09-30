import { Component, inject, OnInit } from '@angular/core';
import { ReservationService } from '../../../Services/reservation.service';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { ReservationModel } from '../../user/reservation.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-trajet',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './detail-trajet.component.html',
  styleUrl: './detail-trajet.component.css'
})
export class DetailTrajetComponent  implements OnInit{
  private reservationService = inject(ReservationService);
  private userService = inject(AuthService);
  private router = inject(Router)
  tabreservation: ReservationModel[] = [];
  selectedTrajetId: number | null = null; // ID du trajet sélectionné
  ngOnInit(): void {
    if (this.selectedTrajetId) {
      this.fetchReservationsByTrajet(this.selectedTrajetId);
    } 
  }



  fetchReservationsByTrajet(trajetId: number) {
    this.reservationService.getReservationsByTrajet(trajetId).subscribe(
      (response:any) => {
        this.tabreservation = response.data; // Met à jour les réservations
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
