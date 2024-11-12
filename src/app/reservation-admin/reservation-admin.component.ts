// import { Component, inject } from '@angular/core';
// import { Router, RouterModule } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { HttpErrorResponse } from '@angular/common/http';
// import { ReservationService } from '../Services/reservation.service';
// import { AuthService } from '../Services/auth.service';
// import { ReservationModel } from '../Composants/user/reservation.model';
// import { UserModel } from '../Composants/user/user.model';

// @Component({
//   selector: 'app-reservation-admin',
//   standalone: true,
//   imports: [FormsModule,CommonModule,RouterModule],
//   templateUrl: './reservation-admin.component.html',
//   styleUrl: './reservation-admin.component.css'
// })
// export class ReservationAdminComponent {

//   private reservationService = inject(ReservationService);
//   private authService = inject(AuthService);
//   private router = inject(Router);
//   isAuthenticated: boolean = false;
//   private userService = inject(AuthService);
//   currentPage: number = 1;
//   itemsPerPage: number = 9;
//   tabreservation: ReservationModel[] = [];

 

//   userObject: UserModel = {};
  
//   userId: number | null = null; 
//   userReservations: ReservationModel[] = [];


//   ngOnInit(): void {
//     const userIdString = localStorage.getItem('user_id');

//     if (userIdString) {
//       this.userId = Number(userIdString);
//       this.loadUserReservations();
//     } else {
//       alert('Vous devez être connecté pour voir l\'historique.');
//       this.router.navigate(['/connexion']);
//     }

  
//       this.isAuthenticated = this.authService.isUserAuthenticated(); // Vérifier si l'utilisateur est authentifié    
 
//   }

//   loadUserReservations() {
//     this.reservationService.getUserReservations().subscribe(
//         (response: any) => {
//             this.tabreservation = response; // Assigner les réservations à tabreservation pour la pagination
//         },
//         (error) => {
//             console.error('Erreur lors du chargement des réservations', error);
//             alert('Une erreur est survenue lors du chargement de vos réservations.');
//         }
//     );
// }


//   isActive(route: string): boolean {
//     return this.router.url === route;
//   }

//   logout(): void {
//     this.userService.logout().subscribe(
//       () => {
//         // Optionnel : Effacer les informations de l'utilisateur
//         localStorage.removeItem('token');
//         // Rediriger vers la page de connexion ou la page d'accueil
//         this.router.navigate(['/connexion']);
//       },
//       (error: HttpErrorResponse) => { // Spécifiez le type pour 'error'
//         console.error('Erreur de déconnexion', error);
//       }
//     );
//   }

// // pagination
//   getDisplayedReservations(): ReservationModel[] {
//     const startIndex = (this.currentPage - 1) * this.itemsPerPage;
//     return this.tabreservation.slice(startIndex, startIndex + this.itemsPerPage);
//   }

//   nextPage() {
//     if (this.currentPage < this.getTotalPages()) {
//       this.currentPage++;
//     }
//   }

//   previousPage() {
//     if (this.currentPage > 1) {
//       this.currentPage--;
//     }
//   }

//   getTotalPages() {
//     return Math.ceil(this.tabreservation.length / this.itemsPerPage);
//   }

// }



import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ReservationService } from '../Services/reservation.service';
import { AuthService } from '../Services/auth.service';
import { ReservationModel } from '../Composants/user/reservation.model';
import { UserModel } from '../Composants/user/user.model';

@Component({
  selector: 'app-reservation-admin',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './reservation-admin.component.html',
  styleUrls: ['./reservation-admin.component.css']
})
export class ReservationAdminComponent {

  private reservationService = inject(ReservationService);
  private authService = inject(AuthService);
  private router = inject(Router);
  isAuthenticated: boolean = false;
  private userService = inject(AuthService);
  currentPage: number = 1;
  itemsPerPage: number = 9;
  tabreservation: ReservationModel[] = [];
  userId: number | null = null; 

  ngOnInit(): void {
    const userIdString = localStorage.getItem('user_id');

    if (userIdString) {
      this.userId = Number(userIdString);
      this.loadUserReservations();
    } else {
      alert('Vous devez être connecté pour voir l\'historique.');
      this.router.navigate(['/connexion']);
    }

    this.isAuthenticated = this.authService.isUserAuthenticated(); 
  }

  loadUserReservations() {
    this.reservationService.getUserReservations().subscribe(
        (response: any) => {
            this.tabreservation = response;
        },
        (error) => {
            console.error('Erreur lors du chargement des réservations', error);
            alert('Une erreur est survenue lors du chargement de vos réservations.');
        }
    );
  }

  // Pagination
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

  logout(): void {
    this.userService.logout().subscribe(
      () => {
        localStorage.removeItem('token');
        this.router.navigate(['/connexion']);
      },
      (error: HttpErrorResponse) => {
        console.error('Erreur de déconnexion', error);
      }
    );
  }
}
