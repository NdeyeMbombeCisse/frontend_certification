// import { Component, inject, OnInit } from '@angular/core';
// import { ReservationService } from '../../../Services/reservation.service';
// import { AuthService } from '../../../Services/auth.service';
// import { Router } from '@angular/router';
// import { ReservationModel } from '../reservation.model';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-historique',
//   standalone: true,
//   imports: [CommonModule,FormsModule],
//   templateUrl: './historique.component.html',
//   styleUrl: './historique.component.css'
// })
// export class HistoriqueComponent  implements OnInit{

//   private reservationService = inject(ReservationService);
//   private authService = inject(AuthService);
//   private router = inject(Router);

//   userId: number | null = null; // ID de l'utilisateur
//   userReservations: ReservationModel[] = []; // Réservations de l'utilisateur

//   ngOnInit(): void {
//     const userIdString = localStorage.getItem('user_id');

//     if (userIdString) {
//       this.userId = Number(userIdString);
//       this.loadUserReservations(this.userId);
//     } else {
//       alert('Vous devez être connecté pour voir l\'historique.');
//       this.router.navigate(['/connexion']);
//     }
//   }

//   loadUserReservations(userId: number) {
//     this.reservationService.getUserReservations(userId).subscribe(
//       (response) => {
//         this.userReservations = response.reservations;
//       },
//       (error) => {
//         console.error('Erreur lors du chargement des réservations', error);
//         alert('Une erreur est survenue lors du chargement de vos réservations.'); // Alerte pour l'utilisateur
//       }
//     );
//   }

  

// }


import { Component, inject, OnInit } from '@angular/core';
import { ReservationService } from '../../../Services/reservation.service';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { ReservationModel } from '../reservation.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent implements OnInit {
  private reservationService = inject(ReservationService);
  private authService = inject(AuthService);
  private router = inject(Router);
  isAuthenticated: boolean = false;
  
  userId: number | null = null; 
  userReservations: ReservationModel[] = [];

  ngOnInit(): void {
    const userIdString = localStorage.getItem('user_id');

    if (userIdString) {
      this.userId = Number(userIdString);
      this.loadUserReservations();
    } else {
      alert('Vous devez être connecté pour voir l\'historique.');
      this.router.navigate(['/connexion']);
    }

  
      this.isAuthenticated = this.authService.isUserAuthenticated(); // Vérifier si l'utilisateur est authentifié
 
  }

  loadUserReservations() {
    this.reservationService.getUserReservations().subscribe(
        (response: any) => {
            this.userReservations = response; // Supposons que l'API retourne directement les réservations
        },
        (error) => {
            console.error('Erreur lors du chargement des réservations', error);
            alert('Une erreur est survenue lors du chargement de vos réservations.');
        }
    );
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
