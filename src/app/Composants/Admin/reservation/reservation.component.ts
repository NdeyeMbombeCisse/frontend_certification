

import { Component, inject, OnInit } from '@angular/core';
import { ReservationService } from '../../../Services/reservation.service';
import { ReservationModel } from '../../user/reservation.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { TrajetModel } from '../trajet.model';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'] // Correction: 'styleUrl' => 'styleUrls'
})
export class ReservationComponent implements OnInit {
  private reservationService = inject(ReservationService);
  private userService = inject(AuthService);
  tabtrajet:TrajetModel[]=[];
  private router = inject(Router)
  tabreservation: ReservationModel[] = [];
  selectedTrajetId: number | null = null; // ID du trajet sélectionné
  filteredReservations: ReservationModel[] = [];

  Prenom: string | null = null;  // Pour stocker la date de départ
  Nom: string | null = null;  // Pour stocker la date d'arrivée
  reservationObject: ReservationModel = {};
  selectedReservation: ReservationModel | null = null;
  isModalOpen: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 9;
  searchTerm: string = '';


  ngOnInit(): void {
    this.fetchReservations(); // Appel à fetchTrajets() pour charger les réservations au démarrage

   
  }

  fetchReservations() {
    this.reservationService.getAllReservation().subscribe(
      (response: any) => {
        console.log(response.data);
        if (response.data) {
          this.tabreservation = response.data;
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  openDetailsPopup(reservation: ReservationModel) {
    this.selectedReservation = reservation;
    this.isModalOpen = true;
  }

  closeDetailsPopup() {
    this.selectedReservation = null;
    this.isModalOpen = false;
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


  // rechercher
  searchTrajets() {
    const term = this.searchTerm?.toLowerCase() || '';
  
    // Filtrer les réservations sans modifier tabreservation
    this.tabreservation = this.tabreservation.filter((reservation: ReservationModel) => {
      const prenom = reservation.user?.prenom?.toLowerCase() || '';
      const nom = reservation.user?.nom?.toLowerCase() || '';
  
      return prenom.includes(term) || nom.includes(term);
    });
  }
}


