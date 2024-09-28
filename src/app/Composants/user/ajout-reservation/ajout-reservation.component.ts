


import { Component, inject, OnInit } from '@angular/core';
import { ReservationService } from '../../../Services/reservation.service';
import { ErrorModel, ReservationModel } from '../reservation.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategorieModel } from '../categorie.model';
import { PlaceModel } from '../place.model';
import { AuthService } from '../../../Services/auth.service'; // Assurez-vous d'importer AuthService
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajout-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ajout-reservation.component.html',
  styleUrls: ['./ajout-reservation.component.css'], // Correction: use 'styleUrls' (pas 'styleUrl')
})
export class AjoutReservationComponent implements OnInit {
  private reservationService = inject(ReservationService);
  private authService = inject(AuthService); // Injecter AuthService
  private router = inject(Router); 
  qrCodeUrl: string | null = null; 
  tarif: any;
  error: string | null = null;
  
  tabreservation: ReservationModel[] = [];
  categories: CategorieModel[] = [];
  places: PlaceModel[] = [];
  selectedCategorie: number | null = null;
  reservationData: ReservationModel = {};

  userId: number | null = null; // Assurez-vous que le type est `number | null`


  ngOnInit(): void {
    const userIdString = localStorage.getItem('user_id'); // Récupère l'ID utilisateur
    console.log('ID utilisateur récupéré:', userIdString); // Ajoute cette ligne pour le débogage

    if (userIdString) {
        this.userId = Number(userIdString); // Convertit l'ID en nombre
        console.log('ID utilisateur converti:', this.userId); // Ajoute cette ligne pour le débogage
    }

    if (!this.userId) {
        alert('Vous devez être connecté pour effectuer une réservation.');
        this.router.navigate(['/connexion']);
        return;
    }

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

  // Méthode pour créer une réservation
  createReservation() {
    this.reservationData.user_id = this.userId; // Assigne l'ID utilisateur (number) à `user_id`

    this.reservationService.createReservation(this.reservationData).subscribe(
      (response: any) => {
        alert(response.message || 'Réservation créée avec succès.');
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
      timestamp: new Date(),
      place_id: undefined,
      trajet_id: undefined,
      user_id: this.userId, // Réinitialiser avec l'ID de l'utilisateur
    };
  }

  // tarif

  onCategorie(categorieId: number) {
    if (categorieId) {
      this.reservationService.getTarifByCategorie(categorieId).subscribe({
        next: (data) => {
          this.tarif = data; // Assigner le tarif récupéré
          this.error = null; // Réinitialiser l'erreur
        },
        error: (err) => {
          this.error = 'Tarif non trouvé'; // Gérer les erreurs
          this.tarif = null; // Réinitialiser le tarif
        }
      });
    } else {
      this.tarif = null; // Réinitialiser le tarif si aucune catégorie n'est sélectionnée
    }
  }
}


// import { Component, inject, OnInit } from '@angular/core';
// import { ReservationService } from '../../../Services/reservation.service';
// import { ErrorModel, ReservationModel } from '../reservation.model';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { CategorieModel } from '../categorie.model';
// import { PlaceModel } from '../place.model';
// import { AuthService } from '../../../Services/auth.service'; // Assurez-vous d'importer AuthService
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-ajout-reservation',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './ajout-reservation.component.html',
//   styleUrls: ['./ajout-reservation.component.css'], // Correction: use 'styleUrls' (pas 'styleUrl')
// })
// export class AjoutReservationComponent implements OnInit {
//   private reservationService = inject(ReservationService);
//   private authService = inject(AuthService); // Injecter AuthService
//   private router = inject(Router); 
  
//   tabreservation: ReservationModel[] = [];
//   categories: CategorieModel[] = [];
//   places: PlaceModel[] = [];
//   selectedCategorie: number | null = null;
//   reservationData: ReservationModel = {};

//   userId: number | null = null; // Assurez-vous que le type est `number | null`
//   userFirstName: string = ''; // Pour stocker le prénom
//   userPhone: string = ''; // Pour stocker le numéro de téléphone

//   qrCodeData: string | null = null; 

//   ngOnInit(): void {
//     const userIdString = localStorage.getItem('user_id'); // Récupère l'ID utilisateur
//     console.log('ID utilisateur récupéré:', userIdString); // Ajoute cette ligne pour le débogage

//     if (userIdString) {
//         this.userId = Number(userIdString); // Convertit l'ID en nombre
//         console.log('ID utilisateur converti:', this.userId); // Ajoute cette ligne pour le débogage
//     }

//     if (!this.userId) {
//         alert('Vous devez être connecté pour effectuer une réservation.');
//         this.router.navigate(['/connexion']);
//         return;
//     }

//     // Récupération du prénom et du numéro de téléphone depuis le localStorage
//     this.userFirstName = localStorage.getItem('user_first_name') || ''; // Récupère le prénom
//     this.userPhone = localStorage.getItem('user_phone') || ''; // Récupère le numéro de téléphone

//     this.reservationService.getCategories().subscribe((data: any) => {
//         this.categories = data;
//     });
//   }

//   onCategorieChange(event: Event): void {
//     const target = event.target as HTMLSelectElement;
//     const categorieId = Number(target.value);
//     this.selectedCategorie = categorieId;

//     this.reservationService.getPlacesByCategorie(categorieId).subscribe((data: any) => {
//       this.places = data;
//     });
//   }

//   // Méthode pour créer une réservation
 



// //   createReservation() {
// //     // Vérifie que les données nécessaires sont présentes
// //     if (!this.reservationData.place_id || !this.reservationData.trajet_id) {
// //         alert("Veuillez sélectionner un lieu et un trajet avant de réserver.");
// //         return;
// //     }

// //     // Assigne l'ID utilisateur (number) à `user_id`
// //     this.reservationData.user_id = this.userId; 

// //     this.reservationService.createReservation(this.reservationData).subscribe(
// //         (response: any) => {
// //             alert(response.message || 'Réservation créée avec succès.');
// //             this.resetForm();
// //         },

        
// //         (error: any) => {
// //             const errorMessage = error.error?.message || 'Erreur lors de la création de la réservation';
// //             alert(errorMessage);
// //         }
// //     );
// // }



// createReservation() {
//   // Vérifie que les données nécessaires sont présentes
//   if (!this.reservationData.place_id || !this.reservationData.trajet_id) {
//       alert("Veuillez sélectionner un lieu et un trajet avant de réserver.");
//       return;
//   }

//   // Assigne l'ID utilisateur (number) à `user_id`
//   this.reservationData.user_id = this.userId; 

//   this.reservationService.createReservation(this.reservationData).subscribe(
//       (response: any) => {
//           alert(response.message || 'Réservation créée avec succès.');

//           // Récupérer les détails nécessaires pour le QR Code
//           const trajetDetails = {
//               // Remplir avec les détails du trajet
//               id: this.reservationData.trajet_id,
//               // Autres détails du trajet que tu souhaites inclure
//           };

//           const userDetails = {
//               id: this.userId,
//               // Autres détails de l'utilisateur que tu souhaites inclure
//           };

//           const qrData = {
//               reservation: this.reservationData,
//               trajet: trajetDetails,
//               user: userDetails,
//           };

//           // Appeler l'API pour générer le QR Code
//           this.reservationService.generateQrCode(qrData).subscribe((qrCodeUrl: string) => {
//               // Assigner l'URL du QR code à une variable pour l'afficher
//               this.qrCodeData = qrCodeUrl;
//           });

//           this.resetForm();
//       },
//       (error: any) => {
//           const errorMessage = error.error?.message || 'Erreur lors de la création de la réservation';
//           alert(errorMessage);
//       }
//   );
// }









//   resetForm() {
//     this.reservationData = {
//       timestamp: new Date(),
//       place_id: undefined,
//       trajet_id: undefined,
//       user_id: this.userId, // Réinitialiser avec l'ID de l'utilisateur
//     };
//   }
// }



// import { Component, inject, OnInit } from '@angular/core';
// import { ReservationService } from '../../../Services/reservation.service';
// import { ErrorModel, ReservationModel } from '../reservation.model';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { CategorieModel } from '../categorie.model';
// import { PlaceModel } from '../place.model';
// import { AuthService } from '../../../Services/auth.service';
// import { Router } from '@angular/router';
// import * as QRCode from 'qrcode'; // Importer la bibliothèque QRCode

// @Component({
//   selector: 'app-ajout-reservation',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './ajout-reservation.component.html',
//   styleUrls: ['./ajout-reservation.component.css'],
// })
// export class AjoutReservationComponent implements OnInit {
//   private reservationService = inject(ReservationService);
//   private authService = inject(AuthService);
//   private router = inject(Router);

//   tabreservation: ReservationModel[] = [];
//   categories: CategorieModel[] = [];
//   places: PlaceModel[] = [];
//   selectedCategorie: number | null = null;
//   reservationData: ReservationModel = {};

//   userId: number | null = null;
//   userFirstName: string = '';
//   userPhone: string = '';

//   qrCodeData: string | null = null;

//   ngOnInit(): void {
//     const userIdString = localStorage.getItem('user_id');
//     if (userIdString) {
//       this.userId = Number(userIdString);
//     }

//     if (!this.userId) {
//       alert('Vous devez être connecté pour effectuer une réservation.');
//       this.router.navigate(['/connexion']);
//       return;
//     }

//     this.userFirstName = localStorage.getItem('user_first_name') || '';
//     this.userPhone = localStorage.getItem('user_phone') || '';

//     this.reservationService.getCategories().subscribe((data: any) => {
//       this.categories = data;
//     });
//   }

//   onCategorieChange(event: Event): void {
//     const target = event.target as HTMLSelectElement;
//     const categorieId = Number(target.value);
//     this.selectedCategorie = categorieId;

//     this.reservationService.getPlacesByCategorie(categorieId).subscribe((data: any) => {
//       this.places = data;
//     });
//   }

//   createReservation() {
//     if (!this.reservationData.place_id || !this.reservationData.trajet_id) {
//       alert('Veuillez sélectionner un lieu et un trajet avant de réserver.');
//       return;
//     }

//     this.reservationData.user_id = this.userId;

//     this.reservationService.createReservation(this.reservationData).subscribe(
//       (response: any) => {
//         alert(response.message || 'Réservation créée avec succès.');

//         const qrData = {
//           reservation: this.reservationData,
//           trajet: { id: this.reservationData.trajet_id },
//           user: { id: this.userId },
//         };

//         // Générer le QR code à partir des données de la réservation
//         this.generateQrCode(qrData);

//         this.resetForm();
//       },
//       (error: any) => {
//         const errorMessage = error.error?.message || 'Erreur lors de la création de la réservation';
//         alert(errorMessage);
//       }
//     );
//   }

//   // Méthode pour générer un QR code
//   generateQrCode(data: any) {
//     const qrString = JSON.stringify(data); // Convertir les données en chaîne de caractères
//     QRCode.toDataURL(qrString, { errorCorrectionLevel: 'H' }, (err, url) => {
//       if (err) {
//         console.error('Erreur lors de la génération du QR Code', err);
//         return;
//       }
//       this.qrCodeData = url; // Stocker l'URL du QR code pour l'afficher
//     });
//   }

//   resetForm() {
//     this.reservationData = {
//       timestamp: new Date(),
//       place_id: undefined,
//       trajet_id: undefined,
//       user_id: this.userId,
//     };
//   }
// }
