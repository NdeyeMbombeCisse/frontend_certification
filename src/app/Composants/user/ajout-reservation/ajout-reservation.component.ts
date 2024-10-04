

import { Component, inject, OnInit } from '@angular/core';
import { ReservationService } from '../../../Services/reservation.service';
import { ErrorModel, ReservationModel } from '../reservation.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategorieModel } from '../categorie.model';
import { PlaceModel } from '../place.model';
import { AuthService } from '../../../Services/auth.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-ajout-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './ajout-reservation.component.html',
  styleUrls: ['./ajout-reservation.component.css'],
})
export class AjoutReservationComponent implements OnInit {
  private reservationService = inject(ReservationService);
  private authService = inject(AuthService);
  private router = inject(Router); 
  private route = inject(ActivatedRoute); // Injecter ActivatedRoute pour accéder aux paramètres de l'URL

  qrCodeUrl: string | null = null; 
  tarif: any;
  error: string | null = null;
  
  tabreservation: ReservationModel[] = [];
  categories: CategorieModel[] = [];
  places: PlaceModel[] = [];
  selectedCategorie: number | null = null;
  reservationData: ReservationModel = {};
  userId: number | null = null; 
  trajetId: number | null = null; // Champ pour stocker l'ID du trajet

  ngOnInit(): void {
    const userIdString = localStorage.getItem('user_id');
    console.log('ID utilisateur récupéré:', userIdString);

    if (userIdString) {
        this.userId = Number(userIdString);
        console.log('ID utilisateur converti:', this.userId);
    }

    if (!this.userId) {
        alert('Vous devez être connecté pour effectuer une réservation.');
        this.router.navigate(['/connexion']);
        return;
    }

    // Récupérer l'ID du trajet depuis les paramètres de l'URL
    this.route.paramMap.subscribe(params => {
        const trajetIdString = params.get('id');
        if (trajetIdString) {
            this.trajetId = Number(trajetIdString);
            console.log('ID du trajet récupéré:', this.trajetId);
        }
    });

    this.reservationService.getCategories().subscribe((data: any) => {
        this.categories = data;
    });
  }

  onCategorieChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const categorieId = Number(target.value);
    this.selectedCategorie = categorieId;

    this.reservationService.getPlacesByCategorie(categorieId).subscribe((data: any) => {
      this.places = data;
    });
  }

  createReservation() {
    if (this.trajetId) {
        this.reservationData.trajet_id = this.trajetId; // Assigner l'ID du trajet
    } else {
        alert('Erreur : ID de trajet non disponible.');
        return;
    }

    this.reservationData.user_id = this.userId; // Assigner l'ID utilisateur

    this.reservationService.createReservation(this.reservationData).subscribe(
        (response: any) => {
          Swal.fire({
            title: 'Succès!',
            text: 'Reservation faite  avec succès!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
         
            // alert(response.message || 'Réservation créée avec succès.');
            this.qrCodeUrl = response.qr_code; // Récupère l'URL du QR code
            this.resetForm();
        },
        (error: any) => {
            const errorMessage = error.error?.message || 'Erreur lors de la création de la réservation';
            alert(errorMessage);
        }
    );
}



  resetForm() {
    this.reservationData = {
      created_at: new Date(),
      place_id: undefined,
      trajet_id: undefined,
      user_id: this.userId,
    };
  }

  onCategorie(categorieId: number) {
    if (categorieId) {
      this.reservationService.getTarifByCategorie(categorieId).subscribe({
        next: (data) => {
          this.tarif = data;
          this.error = null;
        },
        error: (err) => {
          this.error = 'Tarif non trouvé';
          this.tarif = null;
        }
      });
    } else {
      this.tarif = null;
    }
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  
}


