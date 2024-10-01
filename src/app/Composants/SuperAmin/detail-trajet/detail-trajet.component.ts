

import { Component, inject, OnInit } from '@angular/core';
import { ReservationService } from '../../../Services/reservation.service';
import { AuthService } from '../../../Services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReservationModel } from '../../user/reservation.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-detail-trajet',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './detail-trajet.component.html',
  styleUrl: './detail-trajet.component.css'
})
export class DetailTrajetComponent  implements OnInit{
  private reservationService = inject(ReservationService);
  private userService = inject(AuthService);
  private router = inject(Router)
  private route= inject(ActivatedRoute)
  tabreservation: ReservationModel[] = [];
  selectedTrajetId: number | null = null; // ID du trajet sélectionné
  currentPage: number = 1;
  itemsPerPage: number = 9;
 

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.selectedTrajetId = +params['trajetId']; // Convertit l'ID en nombre
      if (this.selectedTrajetId) {
        this.fetchReservationsByTrajet(this.selectedTrajetId);
      }
    });
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

  logout(): void {
    this.userService.logout().subscribe(
      () => {
        // Optionnel : Effacer les informations de l'utilisateur
        localStorage.removeItem('token');
        // Rediriger vers la page de connexion ou la page d'accueil
        this.router.navigate(['/connexion']);
      },
      (error: HttpErrorResponse) => { // Spécifiez le type pour 'error'
        console.error('Erreur de déconnexion', error);
      }
    );
  }
  // pagination

  getDisplayedReservations(): ReservationModel[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.tabreservation.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getTotalPages() {
    return Math.ceil(this.tabreservation.length / this.itemsPerPage);
  }
  isActive(route: string): boolean {
    return this.router.url === route;
  }

}
