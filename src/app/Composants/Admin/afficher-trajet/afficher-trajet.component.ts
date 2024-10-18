import { Component, inject, OnInit } from '@angular/core';
import { TrajetService } from '../../../Services/trajet.service';
import { TrajetModel } from '../trajet.model';
import { BateauModel } from '../bateau.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../Services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReservationModel } from '../../user/reservation.model';
import { BarrechercheComponent } from '../../../barrecherche/barrecherche.component';
import { ProfilComponent } from '../../user/profil/profil.component';
import { ProfilnotifComponent } from '../../../profilnotif/profilnotif.component';
import { ReservationService } from '../../../Services/reservation.service';

@Component({
  selector: 'app-afficher-trajet',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule,BarrechercheComponent,ProfilnotifComponent],
  templateUrl: './afficher-trajet.component.html',
  styleUrl: './afficher-trajet.component.css'
})
export class AfficherTrajetComponent implements OnInit {

  private trajetService = inject(TrajetService);
  private userService = inject(AuthService);
  private router= inject(Router);
  private reservationService = inject(ReservationService)

  // declaration des variables
  tabtrajet:TrajetModel[]=[];
  trajetObject:TrajetModel = {};
  tabBateaux:BateauModel[] =[];
  selectedTrajet: TrajetModel | null = null; 
  reservations: ReservationModel = {};
  dateDepart: string | null = null;  // Pour stocker la date de départ
  dateArrivee: string | null = null;  // Pour stocker la date d'arrivée
  searchTerm: string = '';
  filteredTrajets: TrajetModel[] = [];

  // Variables de pagination
  currentPage: number = 1;
  itemsPerPage: number = 9;

  ngOnInit(): void {
    this.fetchBateaux();
    this.fetchTrajets();
  }

  fetchTrajets(){
    this.trajetService.getAllTrajet().subscribe(
      (response:any)=>{
        console.log(response.data);
        if(response.data){
          this.tabtrajet = response.data;
        } 
      },(error:any)=>{
        console.log(error);
      }
    )
  }

  fetchBateaux(){
    this.trajetService.getAllBateaux().subscribe(
      (response:any)=>{
        console.log(response.data);
        if(response.data){
          this.tabBateaux = response.data;
        } 
      },(error:any)=>{
        console.log(error);
      }
    )
  }

  getDisplayedTrajets(): TrajetModel[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.tabtrajet.slice(startIndex, startIndex + this.itemsPerPage);
}
  // Méthodes pour la pagination
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
    return Math.ceil(this.tabtrajet.length / this.itemsPerPage);
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

  // supprimer un trajet
  deleteTrajet(id: any) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce trajet ?")) {
      this.trajetService.deleteTrajet(id).subscribe(
        (response: any) => {
          console.log('Trajet supprimé', response);
          this.tabtrajet = this.tabtrajet.filter(trajet => trajet.id !== id);
        },
        (error: any) => {
          console.error('Erreur lors de la suppression du trajet', error);
        }
      );
    }}


    // modification

    updateTrajet() {
      if (this.selectedTrajet) {
        this.trajetService.updateTrajet(this.selectedTrajet.id, this.selectedTrajet).subscribe(
          (response: any) => {
            console.log('Trajet mis à jour', response);
            this.selectedTrajet = null; // Réinitialiser le trajet sélectionné après mise à jour
            this.fetchTrajets(); // Rafraîchir la liste des trajets
          },
          (error: any) => {
            console.error('Erreur lors de la mise à jour du trajet', error);
          }
        );
      }    
}

editTrajet(trajet: TrajetModel) {
  this.router.navigate([`/ModifierTrajet/${trajet.id}`], { state: { trajet } });
}

// changer le statut
changerStatut(trajet: any) {
  if (trajet && trajet.id !== undefined) {
    // Inverser le statut du trajet sélectionné
    trajet.statut = !trajet.statut;

    // Appel au service pour mettre à jour le statut
    this.trajetService.updateStatutTrajet(trajet.id, { statut: trajet.statut }).subscribe(
      (response: any) => {
        console.log('Statut du trajet modifié:', response);
        alert('Statut du trajet mis à jour avec succès.');
      },
      (error: any) => {
        console.error('Erreur lors de la modification du statut du trajet:', error);
      }
    );
  } else {
    console.error('ID du trajet manquant.');
  }
}

navigateToplace(trajetId: any): void {
  this.router.navigate([`trajet/${trajetId}`]);
}



viewReservationDetails(trajetId: any) {
  this.router.navigate([`/trajet/${trajetId}/reservations`]);
}


isActive(route: string): boolean {
  return this.router.url === route;
}






searchTrajets() {
    const term = this.searchTerm?.toLowerCase() || '';

    this.tabtrajet = this.tabtrajet.filter((trajet: TrajetModel) => {
        // Vérifiez si date_depart et date_arrivee existent avant d'appliquer toLowerCase
        const departDateString = trajet.date_depart ? new Date(trajet.date_depart).toISOString() : '';
        const arriveeDateString = trajet.date_arrivee ? new Date(trajet.date_arrivee).toISOString() : '';

        return (
            departDateString.includes(term) || 
            arriveeDateString.includes(term)
        );
    });
}



}







