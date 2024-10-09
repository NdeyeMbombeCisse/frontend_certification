import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { TrajetService } from '../../../Services/trajet.service';
import { ReservationService } from '../../../Services/reservation.service';
import { CommonModule } from '@angular/common';
import { TrajetModel } from '../trajet.model';

@Component({
  selector: 'app-dashboad-admin',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './dashboad-admin.component.html',
  styleUrl: './dashboad-admin.component.css'
})
export class DashboadAdminComponent implements OnInit {
  private trajetService = inject(TrajetService);
  private reservationService = inject(ReservationService);
  private router = inject(Router);
  private userService = inject(AuthService);
  count: number = 0;
  countreservation: number = 0;
  placesRestantes:number =0;
  totalPlacesRestantes:number=0;
  trajetsEnCours: TrajetModel[] = [];

  ngOnInit(): void {
  

    

    this.loadTrajets()
  

   
    
  }

 
 
  loadTrajets(){
    this.trajetService.getTrajetsEnCours().subscribe(
      (response: any) => {
        console.log(response.data); // Vérifiez la structure ici
        this.trajetsEnCours = response.data; // Vérifiez si response.data est un tableau
      },
      (error) => {
        console.error('Erreur lors de la récupération des trajets', error);
      }
    );
  }
  

  isActive(route: string): boolean {
    return this.router.url === route;
  }

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
}
