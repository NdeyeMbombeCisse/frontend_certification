import { Component, inject, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ReservationService } from '../Services/reservation.service';
import { PlaceModel } from '../Composants/user/place.model';
import Swal from 'sweetalert2';
import { ReservationModel } from '../Composants/user/reservation.model';
import { CategorieModel } from '../Composants/user/categorie.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NoconectModel } from '../Composants/user/autrereservation';

@Component({
  selector: 'app-autrereservation',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './autrereservation.component.html',
  styleUrl: './autrereservation.component.css'
})
export class AutrereservationComponent implements OnInit {
  selectedCategorie: number | null = null;
  reservedPlaces: number[] = [];
  places: PlaceModel[] = [];
  selectPlaceId: any| null = null; 
  reservationData: ReservationModel= {};
  categories: CategorieModel[] = [];
  tarif: any;
  noconnect:NoconectModel={};
  fusion:any;
  error: string | null = null;
  formData: any;
  trajetId: number | null = null; // Champ pour stocker l'ID du trajet

  private reservationService = inject(ReservationService);
  private router = inject(Router); 
  private route = inject(ActivatedRoute); // Injecter ActivatedRoute pour accéder aux paramètres de l'URL




  ngOnInit(): void {
    // Récupère les données du formulaire depuis le service
    this.formData = this.reservationService.getFormData();
    console.log(this.formData);
    
    if (!this.formData) {
      console.error('Les informations de réservation sont manquantes');
    }
    this.getCategories();
    this.route.params.subscribe(params => {

      this.trajetId = +params['id']; // Le `+` convertit la chaîne en nombre
      console.log(this.trajetId);
      
      const trajetId = this.route.snapshot.paramMap.get('id'); // Supposons que vous récupériez l'ID du trajet depuis l'URL
      this.loadReservedPlacesForTrajet(trajetId);
    });

  }

  
  onCategorieSelect(id: any, trajetId: any) {
    this.selectedCategorie = id;
    console.log(trajetId);
    
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


onCategorie(categorieId: number) {
  if (categorieId) {
    this.reservationService.getTarifByCategorie(categorieId).subscribe({
      next: (data) => {
        this.tarif = data;
        this.error= null;
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



createReservation() {
  if (!this.trajetId) {
    alert('Erreur : ID de trajet non disponible.');
    return;
  }

  // Supposons que les données `noconnect` sont récupérées via `getFormData()`
  this.reservationData.trajet_id = this.trajetId;

  // Assurez-vous que noconnect est bien initialisé avant cet accès
  this.noconnect = this.formData; // Récupérer les données
console.log('sama no connect',this.noconnect);

  // Vérifier si noconnect est défini et contient des propriétés attendues
  if (this.noconnect) {
    // Accéder directement aux propriétés de l'objet noconnect
    const prenom = this.noconnect.prenom;
    const nom = this.noconnect.nom;
    const age = this.noconnect.age;
    const nationnalite = this.noconnect.nationnalite;
    const numero_identite = this.noconnect.numero_identite;
    const numero_registre = this.noconnect.numero_registre;

    console.log("Prénom :", prenom);
    console.log("Nom :", nom);
    console.log("Age :", age);
    console.log("Nationalité :", nationnalite);
    console.log("Numéro d'identité :", numero_identite);
    console.log("Numéro registre :", numero_registre);

    // Fusionner les données dans l'objet `fusion`
    this.fusion = {
      trajet_id: this.reservationData.trajet_id,
      place_id:this.reservationData.place_id,
        prenom: prenom,
        nom: nom,
        age: age,
        nationnalite: nationnalite,
        numero_identite: numero_identite,
        numero_registre: numero_registre,
      
    };
  } else {
    console.error("Erreur : noconnect est undefined ou ne contient pas les données attendues.");
    return; // Si noconnect est vide ou ne contient pas les données, arrêter l'exécution
  }



  console.log(this.fusion);

  // Appeler le service pour créer la réservation
  this.reservationService.othiereservation(this.fusion).subscribe(
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


isActive(route: string): boolean {
  return this.router.url === route;
}

isMenuOpen = false;

toggleMenu() {
  this.isMenuOpen = !this.isMenuOpen;
}


}
