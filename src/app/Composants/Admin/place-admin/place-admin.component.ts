import { Component, inject, OnInit } from '@angular/core';
import { ReservationModel } from '../../user/reservation.model';
import { CategorieModel } from '../../user/categorie.model';
import { PlaceModel } from '../../user/place.model';
import { ReservationService } from '../../../Services/reservation.service';
import { AuthService } from '../../../Services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-place-admin',
  standalone: true,
  imports: [RouterModule,FormsModule,CommonModule],
  templateUrl: './place-admin.component.html',
  styleUrl: './place-admin.component.css'
})
export class PlaceAdminComponent implements OnInit {
  private reservationService = inject(ReservationService);
  private authService = inject(AuthService);
  private router = inject(Router); 
  private route = inject(ActivatedRoute); // Injecter ActivatedRoute pour accéder aux paramètres de l'URL

  qrCodeUrl: string | null = null; 
  tarif: any;
  error: string | null = null;
 private userService = inject(AuthService)

  
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



 // Méthode de déconnexion
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

  togglePlaceReservation(place: any, event: MouseEvent): void {
    // Empêche la propagation du clic vers l'élément parent
    event.stopPropagation();
  
    // Vérifie si la place est déjà réservée
    if (this.isPlaceReserved(place.id)) {
      Swal.fire({
        icon: 'warning',
        title: 'Place déjà réservée',
        text: 'Cette place est déjà réservée. Veuillez en choisir une autre.',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    // Prépare les données de réservation
    this.reservationData.place_id = place.id;
    this.reservationData.trajet_id = this.trajetId; // Assurez-vous que trajetId est défini
    this.reservationData.user_id = this.userId; // Assurez-vous que userId est défini
  
    // Appelle le service pour créer la réservation
    this.reservationService.createReservation(this.reservationData).subscribe({
      next: (response: any) => {
        Swal.fire({
          title: 'Succès!',
          text: 'Réservation faite avec succès!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          // Redirigez ou rechargez les données nécessaires après la réservation
          this.loadReservedPlacesForTrajet(this.trajetId);
        });
        
        // Ajouter l'ID de la place réservée à la liste des places réservées
        this.reservedPlaces.push(place.id);
      },
      error: (error) => {
        const errorMessage = error.error?.message || 'Erreur lors de la création de la réservation';
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMessage,
          confirmButtonText: 'OK'
        });
      }
    });
  }
  


  
  

  
  isActive(route: string): boolean {
    return this.router.url === route;
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

getImageForPlace(categoryId: any): string {
  const placeCategoryMap: { [key: number]: string } = {
    1: '../../../../assets/images/fauteil\ pullman.png', // ID pour fauteuils
    2: '../../../../assets/images/cabines.png', // ID pour cabines
    3: '../../../../assets/images/cabines.png', // ID pour cabines
    4: '../../../../assets/images/cabines.png', // ID pour cabines


    // Ajoutez d'autres mappings si nécessaire
  };

  return placeCategoryMap[categoryId] || '../../../../assets/images/default.png'; // Image par défaut
}

  
  
}







// import { Component, inject, OnInit } from '@angular/core';
// import { ReservationModel } from '../../user/reservation.model';
// import { CategorieModel } from '../../user/categorie.model';
// import { PlaceModel } from '../../user/place.model';
// import { ReservationService } from '../../../Services/reservation.service';
// import { AuthService } from '../../../Services/auth.service';
// import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import Swal from 'sweetalert2';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { HttpErrorResponse } from '@angular/common/http';


// @Component({
//   selector: 'app-place-admin',
//   standalone: true,
//   imports: [RouterModule,FormsModule,CommonModule],
//   templateUrl: './place-admin.component.html',
//   styleUrl: './place-admin.component.css'
// })
// export class PlaceAdminComponent implements OnInit {
//   private router = inject(Router);
//   private userService = inject(AuthService)

//   private reservationService = inject(ReservationService);
//   categories: CategorieModel[] = [];
//   places: PlaceModel[] = [];
//   selectedCategorie: number | null = null;
//   trajetId?: number; 

//   ngOnInit(): void {
//     // Récupérer les catégories
//     this.reservationService.getCategories().subscribe((data: any) => {
//       this.categories = data;
//     });
//   }

//   onCategorieSelect(id: any, trajetId: any) {
//     this.selectedCategorie = id;
  
//     // Récupérer les places de la catégorie sélectionnée et du trajet
//     this.reservationService.getPlacesByCategorie(id, trajetId).subscribe(
//       (data: any) => {
//         this.places = data;
//         console.log('Places de la catégorie sélectionnée:', this.places); // Log pour le débogage
//       },
//       (error) => {
//         console.error('Erreur lors de la récupération des places:', error);
//       }
//     );
// }


//   togglePlaceReservation(place: any) {
//     // Changer l'état de la réservation de la place localement
//     place.is_reserved = !place.is_reserved;
  
//     // Appel à un service pour mettre à jour la base de données
//     this.reservationService.updatePlaceReservation(place.id, place.is_reserved).subscribe(
//       (response) => {
//         console.log(`Place ${place.id} mise à jour avec succès : ${place.is_reserved}`);
//       },
//       (error) => {
//         console.error('Erreur lors de la mise à jour de la réservation:', error);
//         // Optionnel: Rétablir l'état précédent en cas d'erreur
//         place.is_reserved = !place.is_reserved; // Rétablir l'état précédent
//       }
//     );
//   }
  

//   isActive(route: string): boolean {
//     return this.router.url === route;
//   }
//     // Méthode de déconnexion
//     logout(): void {
//       this.userService.logout().subscribe(
//         () => {
//           // Optionnel : Effacer les informations de l'utilisateur
//           localStorage.removeItem('token');
//           // Rediriger vers la page de connexion ou la page d'accueil
//           this.router.navigate(['/connexion']);
//         },
//         (error: HttpErrorResponse) => { // Spécifiez le type pour 'error'
//           console.error('Erreur de déconnexion', error);
//         }
//       );
//     }




// getImageForPlace(categoryId: any): string {
//   const placeCategoryMap: { [key: number]: string } = {
//     1: '../../../../assets/images/fauteil\ pullman.png', // ID pour fauteuils
//     2: '../../../../assets/images/cabines.png', // ID pour cabines
//     3: '../../../../assets/images/cabines.png', // ID pour cabines
//     4: '../../../../assets/images/cabines.png', // ID pour cabines


//     // Ajoutez d'autres mappings si nécessaire
//   };

//   return placeCategoryMap[categoryId] || '../../../../assets/images/default.png'; // Image par défaut
// }

  
// }









  

  




  

  


