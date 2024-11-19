




import { Component, inject, OnInit } from '@angular/core';
import { ReservationService } from '../../../Services/reservation.service';
import { ErrorModel, ReservationModel } from '../reservation.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategorieModel } from '../categorie.model';
import { PlaceModel } from '../place.model';
import { AuthService } from '../../../Services/auth.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
import { NoconectModel } from '../autrereservation';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-ajout-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule,ReactiveFormsModule],
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
  reservationId: number | null = null;
  isChildReservation: boolean = false;
  reservationTypeSelected: boolean = false; 
  showForm: boolean = false;
  showCurrentReservation: boolean = true;
  selectedUserId: number | null = null; 
  noconnect:NoconectModel[]=[];

  placeSelected: boolean = false;
  

  // nouv
  currentReservation: any = null;

  ngOnInit(): void {
    const userIdString = localStorage.getItem('user_id');
    console.log('ID utilisateur récupéré:', userIdString);
    // Récupérer l'ID du trajet depuis les paramètres de la route
    this.route.params.subscribe(params => {
      this.trajetId = +params['trajetId']; // Le `+` convertit la chaîne en nombre
      
      const trajetId = this.route.snapshot.paramMap.get('id'); // Supposons que vous récupériez l'ID du trajet depuis l'URL
      this.loadReservedPlacesForTrajet(trajetId);
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


    // nouv
  
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
  
        // Si aucune place n'est disponible pour cette catégorie
        if (this.places.length === 0) {
          Swal.fire({
            icon: 'warning',
            title: 'Aucune place disponible',
            text: 'Il n\'y a pas de places disponibles pour cette catégorie.',
            confirmButtonText: 'OK'
          });
        }
  
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
    this.placeSelected = true; 
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
      return '../../../../assets/images/fauteuilbouna.png';
    case 2: // ID pour cabines
      return '../../../../assets/images/cabines.png';
    default:
      return '../../../../assets/images/cabines.png'; // Image par défaut
  }
}

createReservation() {
  if (!this.trajetId || !this.userId) {
    alert('Erreur : ID de trajet ou utilisateur non disponible.');
    return;
  }

  this.reservationData.trajet_id = this.trajetId;
  this.reservationData.user_id = this.userId;

  this.reservationService.createReservation(this.reservationData).subscribe(
    (response: any) => {
      Swal.fire({
        title: 'Succès!',
        text: 'Réservation faite avec succès!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        const reservationId = response.reservation?.id; // Utilisez response.reservation.id
        if (reservationId) {
          this.initiatePayment(reservationId); // Appel de la méthode de paiement
        } else {
          console.error("ID de réservation non trouvé dans la réponse");
        }
      });
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


// reserver pour une autre personne



showReservationForm() {
  // Logique pour afficher le formulaire correspondant
  // Cela peut inclure la manipulation de l'interface utilisateur pour afficher les champs nécessaires
}

// Méthode pour créer une réservation



private initiatePayment(reservationId: number) {
  this.reservationService.createTransaction(reservationId).subscribe(
    (paymentResponse: any) => {
      const checkoutUrl = paymentResponse.payment_response?.checkout_url;

      if (checkoutUrl) {
        // Redirection automatique vers l'URL de paiement
        window.location.href = checkoutUrl; 
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur de paiement',
          text: 'URL de paiement non disponible.',
          confirmButtonText: 'OK'
        });
      }
    },
    (error: any) => {
      Swal.fire({
        icon: 'error',
        title: 'Erreur de paiement',
        text: error.error?.message || 'Erreur lors de l’initiation du paiement',
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


  
  isActive(route: string): boolean {
    return this.router.url === route;
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }


  logout(): void {
    this.authService.logout().subscribe(
      () => {
        // Optionnel : Effacer les informations de l'utilisateur
        localStorage.removeItem('token');
        // Rediriger vers la page de connexion ou la page d'accueil
        this.router.navigate(['/portail']);
      },
      (error: HttpErrorResponse) => { // Spécifiez le type pour 'error'
        console.error('Erreur de déconnexion', error);
      }
    );
  }


  
}










