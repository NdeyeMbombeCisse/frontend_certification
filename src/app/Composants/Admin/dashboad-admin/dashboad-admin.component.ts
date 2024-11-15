import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { TrajetService } from '../../../Services/trajet.service';
import { ReservationService } from '../../../Services/reservation.service';
import { CommonModule } from '@angular/common';
import { TrajetModel } from '../trajet.model';
import { NotificationModel } from '../notification.model';
import { Chart, registerables, ChartOptions } from 'chart.js';
import { DiagrammeComponent } from '../../../diagramme/diagramme.component';

@Component({
  selector: 'app-dashboad-admin',
  standalone: true,
  imports: [RouterModule,CommonModule,DiagrammeComponent],
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
  notifications:any;
  showNotifications: boolean = false; // État d'affichage
  unreadCount: number = 0;
  userCount: number = 0;
  nouserCount: number = 0;


  ngOnInit(): void {

    this.userService.getUserCount().subscribe(
      (response: any) => {
        console.log(response); // Affichez la réponse
        this.userCount = response.user_count; // Assurez-vous que 'user_count' est bien là
        console.log(this.userCount); // Affichez la valeur de 'userCount'
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    );

    this.userService.getnoUserCount().subscribe(
      (response: any) => {
        console.log(response); // Affichez la réponse
        this.nouserCount = response.user_count; // Assurez-vous que 'user_count' est bien là
        console.log(this.userCount); // Affichez la valeur de 'userCount'
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    );


    this.loadNotifications();
    this.updateUnreadCount();
    this.loadTrajets(); 
    
    
    

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


  // notification

  loadNotifications(): void {
    this.reservationService.getNotifications().subscribe(
      (data: any) => {
        this.notifications = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des notifications', error);
      }
    );
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications; // Alterner l'état d'affichage
  }

  updateUnreadCount() {
    this.unreadCount = this.notifications.filter((notification: NotificationModel) => !notification.data).length;
}


// loadCountUser() {
//   this.userService.getUserCount().subscribe(
//     (response: any) => {
//       console.log(response); // Vérifiez la réponse complète ici
//       this.userCount = response.user_count; // Assurez-vous d'utiliser user_count directement
//     },
//     (error) => {
//       console.error('Erreur lors de la récupération des utilisateurs', error);
//     }
//   );
// }



// Définir chartType comme 'bar'


}
