


import { Component, inject, OnInit } from '@angular/core';
import { ReservationService } from '../../../Services/reservation.service';
import { AuthService } from '../../../Services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ReservationModel } from '../reservation.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { UserModel } from '../user.model';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent implements OnInit {
  private reservationService = inject(ReservationService);
  private authService = inject(AuthService);
  private router = inject(Router);
  isAuthenticated: boolean = false;

  userObject: UserModel = {};
  
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

  fetchUserProfile() {
    this.authService.profil().subscribe(
      (response: any) => {
        console.log(response); // Inspecter la structure de la réponse
        this.userObject = response.user || response; // Si la donnée est directement dans response
      },
      (error: any) => {
        console.log('Erreur de récupération du profil:', error);
      }
    );
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

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
