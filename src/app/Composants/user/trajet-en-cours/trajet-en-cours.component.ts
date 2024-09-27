

// reserverBillet(trajet: TrajetModel, placeId: number) {
//   const reservationData = {
//     date_reservation: new Date().toISOString(),
//     trajet_id: trajet.id,
//     user_id: 1, // Récupérer l'ID de l'utilisateur connecté
//     place_id: placeId, // Utiliser le placeId passé en paramètre
//   };

//   this.reservationService.reserverTrajet(reservationData).subscribe(
//     (response) => {
//       console.log('Réservation réussie', response);
//       alert('Votre réservation a été effectuée avec succès.');
//     },
//     (error) => {
//       console.log('Erreur lors de la réservation', error);
//       alert('Une erreur est survenue lors de la réservation.');
//     }
//   );
// }


// 


import { Component, inject, OnInit } from '@angular/core';
import { TrajetModel } from '../../Admin/trajet.model';
import { TrajetService } from '../../../Services/trajet.service';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../../Services/reservation.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-trajet-en-cours',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './trajet-en-cours.component.html',
  styleUrls: ['./trajet-en-cours.component.css'] // Correction de styleUrl à styleUrls
})
export class TrajetEnCoursComponent implements OnInit {
  private trajetService = inject(TrajetService);
  private reservationService = inject(ReservationService);

  // Déclaration des variables
  tabtrajet: TrajetModel[] = [];
  dateDepartOptions: string[] = []; // Pour stocker les dates de départ
  lieuDepartOptions: string[] = []; // Pour stocker les lieux de départ
  selectedDate: string | null = null; // Pour stocker la date sélectionnée
  selectedLieuDepart: string | null = null; // Pour stocker le lieu de départ sélectionné
  noTrajetMessage: string = '';

  ngOnInit(): void {
    this.fetchTrajets();
  }

  fetchTrajets() {
    this.trajetService.getAllTrajet().subscribe(
      (response: any) => {
        console.log(response.data);
        if (response.data) {
          this.tabtrajet = response.data;
          this.getActiveDepartureDates(); // Appel de la méthode pour obtenir les dates de départ
          this.getActiveDeparturePlaces(); // Appel de la méthode pour obtenir les lieux de départ
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  // Méthode pour récupérer les dates de départ des trajets actifs
  getActiveDepartureDates() {
    this.dateDepartOptions = this.tabtrajet
      .filter(trajet => trajet.statut === 1) // Filtrer les trajets actifs
      .map(trajet => {
        if (trajet.date_depart) {
          return new Date(trajet.date_depart).toLocaleDateString(); // Conversion sécurisée
        }
        return ''; // Retourne une chaîne vide si date_depart est undefined
      })
      .filter(date => date !== ''); // Filtrer les valeurs vides
  }

  // Méthode pour récupérer les lieux de départ actifs
  getActiveDeparturePlaces() {
    this.lieuDepartOptions = this.tabtrajet
      .filter(trajet => trajet.statut === 1) // Filtrer les trajets actifs
      .map(trajet => trajet.lieu_depart) // Récupérer les lieux de départ
      .filter((lieu): lieu is string => !!lieu); // Filtrer les valeurs null/undefined et garder uniquement les chaînes de caractères
  }

  



  getDisplayedTrajets() {
    const filteredTrajets = this.tabtrajet.filter(trajet => {
      const dateDepart = trajet.date_depart ? new Date(trajet.date_depart).toLocaleDateString() : '';
      const matchesDate = this.selectedDate ? dateDepart === this.selectedDate : true;
      const matchesLieu = this.selectedLieuDepart ? trajet.lieu_depart === this.selectedLieuDepart : true;
      return matchesDate && matchesLieu; // Retourne les trajets qui correspondent à la date et au lieu sélectionnés
    });
  
    // Limiter à deux trajets
    return filteredTrajets.slice(0, 2);
  }

 filterTrajets() {
        console.log('Chargement des trajets...');
        const displayedTrajets = this.getDisplayedTrajets();

        if (displayedTrajets.length === 0) {
            this.noTrajetMessage = 'Trajet indisponible'; // Met à jour le message
            console.log('Aucun trajet trouvé pour les critères sélectionnés.');
        } else {
            this.noTrajetMessage = ''; // Réinitialise le message
            console.log(`Nombre de trajets trouvés : ${displayedTrajets.length}`);
        }
    }
  
}
