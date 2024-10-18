

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
import { forkJoin } from 'rxjs';


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
  reservedPlaces: number[] = [];
  availablePlaces: PlaceModel[] = [];
  selectedPlace: PlaceModel | null = null; 
  selectPlaceId: any| null = null; 

  ngOnInit(): void {
    const userIdString = localStorage.getItem('user_id');
    console.log('ID utilisateur récupéré:', userIdString);
    // Récupérer l'ID du trajet depuis les paramètres de la route
    this.route.params.subscribe(params => {
      this.trajetId = +params['trajetId']; // Le `+` convertit la chaîne en nombre
      
      const trajetId = this.route.snapshot.paramMap.get('id'); // Supposons que vous récupériez l'ID du trajet depuis l'URL
      this.loadReservedPlacesForTrajet(trajetId);
      // this.getReservedPlaces(trajetId);

    });

    


    if (userIdString) {
        this.userId = Number(userIdString);
        console.log('ID utilisateur converti:', this.userId);
    }

    if (!this.userId) {
      Swal.fire('Erreur', 'Connectez pour pouvoir effectuer une reservation', 'error');
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



  onCategorieSelect(id: any, trajetId: any) {
    this.selectedCategorie = id;
  
    // Charger à la fois les places réservées et les places de la catégorie sélectionnée
    forkJoin({
      reservedPlaces: this.reservationService.getReservedPlaces(trajetId),
      availablePlaces: this.reservationService.getPlacesByCategorie(id, trajetId)
    }).subscribe({
      next: ({ reservedPlaces, availablePlaces }: any) => {
        // Stocker les places réservées
        this.reservedPlaces = reservedPlaces.data.map((item: any) => item.place.id);
        console.log('Places réservées (IDs):', this.reservedPlaces); // Debugging
  
        // Filtrer les places disponibles pour ne garder que celles qui ne sont pas réservées
        this.places = availablePlaces.filter((place: any) => {
          const reserved = this.isPlaceReserved(place.id); // Vérifie si la place est réservée
          console.log(`Place ID: ${place.id}, Réservée: ${reserved}`); // Debugging
          return !reserved; // Ne garder que les places non réservées
        });
  
        console.log('Places non réservées pour la catégorie sélectionnée:', this.places); // Debugging
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
      }
    });
  }
  

  // les places deja reserver
  loadReservedPlacesForTrajet(trajetId: any): void {
    this.reservationService.getReservedPlaces(trajetId).subscribe({
        next: (response: any) => {
            this.reservedPlaces = response.data.map((item: any) => item.place); // Récupère toutes les places
            
            console.log('Places réservées pour le trajet:', this.reservedPlaces); // Debugging
        },
        error: (error) => {
            console.error('Erreur lors du chargement des places réservées:', error);
            // Gérer l'affichage d'un message d'erreur à l'utilisateur si nécessaire
        }
    });
}

isPlaceReserved(id?: number): boolean {
  const reserved = this.reservedPlaces.includes(id as number);
  // console.log(`Place ID: ${id}, Réservée: ${reserved}`);
  return reserved;
}


selectPlace(place: PlaceModel): void {
  if (this.isPlaceReserved(place.id)) { 
    // Si la place est réservée, afficher un message d'alerte
    Swal.fire({
      icon: 'warning',
      title: 'Place réservée',
      text: 'Cette place est déjà réservée. Veuillez en choisir une autre.',
      confirmButtonText: 'OK'
    });
  } else {
    // Sélection de la place non réservée
    this.selectPlaceId = place.id;
    this.reservationData.place_id = place.id;
  }
}

  


  getIconForCategorie(categorieId: any): string {
    switch (categorieId) {
      case 1: // ID pour fauteuils
        return '../../../../assets/images/categoriefeuteuil.png';
      case 2: // ID pour cabine 2 personnes
        return '../../../../assets/images/cabine2personnes.png';
      case 3: // ID pour cabine 4 personnes
        return '../../../../assets/images/categorie4.png'; // Chemin pour l'image cabine 4 personnes
      default:
        return '../../../../assets/images/cabine8.png'; // Image par défaut
    }
  }
  


// onCategorieChange(event: Event): void {
//   const target = event.target as HTMLSelectElement;
//   const categorieId = Number(target.value);
//   this.selectedCategorie = categorieId;

//   this.reservationService.getPlacesByCategorie(categorieId).subscribe(
//     (data: any) => {
//       // Récupère toutes les places, sans filtrer celles qui sont réservées
//       this.places = data;
//       console.log('Toutes les places:', this.places); // Log pour le débogage
//     },
//     (error) => {
//       console.error('Erreur lors de la récupération des places:', error);
//     }
//   );
// }


// onCategorieChange(event: Event, trajetId: any): void {
//   const target = event.target as HTMLSelectElement;
//   const categorieId = Number(target.value);
//   this.selectedCategorie = categorieId;

//   // Récupérer les places de la catégorie sélectionnée et du trajet
//   this.reservationService.getPlacesByCategorie(categorieId, trajetId).subscribe(
//     (data: any) => {
//       // Récupère toutes les places, sans filtrer celles qui sont réservées
//       this.places = data;
//       console.log('Toutes les places:', this.places); // Log pour le débogage
//     },
//     (error) => {
//       console.error('Erreur lors de la récupération des places:', error);
//     }
//   );
// }



getCategories(): void {
  this.reservationService.getCategories().subscribe(
    (data: any) => {
      this.categories = data;
    },
    (error) => {
      console.error('Erreur lors de la récupération des catégories:', error);
    }
  );
}





getImageForCategorie(categorieId: any): string {
  switch (categorieId) {
    case 1: // ID pour fauteuils
      return '../../../../assets/images/fauteil\ pullman.png';
    case 2: // ID pour cabines
      return '../../../../assets/images/cabines.png';
    default:
      return '../../../../assets/images/cabines.png'; // Image par défaut
  }
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
          text: 'Réservation faite avec succès!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          // Rediriger vers la page de paiement après que l'utilisateur clique sur "OK"
          window.location.href = 'https://checkout.naboopay.com/checkout/ec597225-ad9d-40ac-9339-3095bdb5615d';
        });
        
        this.qrCodeUrl = response.qr_code; // Récupère l'URL du QR code
        this.resetForm();
          
      },
      (error: any) => {
        const errorMessage = error.error?.message || 'Erreur lors de la création de la réservation';
    
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: errorMessage,
            confirmButtonText: 'OK'
        });
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

  // places deja reservee

//   getReservedPlaces(trajetId: any): void {
//     if (this.trajetId) {
//         this.reservationService.getReservedPlaces(this.trajetId).subscribe(
//             (response: any) => {
//                 if (response && response.data) { // Changer reserved_places à data
//                     this.reservedPlaces = response.data; // Correction
//                     console.log('Places réservées récupérées:', this.reservedPlaces); // Debugging
//                 } else {
//                     this.error = 'Aucune place réservée trouvée.';
//                     this.reservedPlaces = [];
//                 }
//                 this.error = null;
//             },
//             (error) => {
//                 this.error = 'Erreur lors de la récupération des places réservées.';
//                 console.error('Erreur:', error);
//             }
//         );
//     } else {
//         this.reservedPlaces = [];
//     }
// }

  
  
  isActive(route: string): boolean {
    return this.router.url === route;
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }


  



}



