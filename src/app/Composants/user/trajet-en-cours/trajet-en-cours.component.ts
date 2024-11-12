


import { Component, inject, OnInit } from '@angular/core';
import { TrajetModel } from '../../Admin/trajet.model';
import { TrajetService } from '../../../Services/trajet.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NoconectModel } from '../autrereservation';
import { ReservationService } from '../../../Services/reservation.service';
import { ReservationModel } from '../reservation.model';

@Component({
  selector: 'app-trajet-en-cours',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './trajet-en-cours.component.html',
  styleUrls: ['./trajet-en-cours.component.css'] 
})
export class TrajetEnCoursComponent implements OnInit {
  private trajetService = inject(TrajetService);
  private reservationService = inject(ReservationService);

  private router = inject(Router);
  currentPage: string = 'portail';

  tabtrajet: TrajetModel[] = [];
  dateDepartOptions: string[] = [];
  lieuDepartOptions: string[] = [];
  selectedDate: string | null = null;
  selectedLieuDepart: string | null = null;
  noTrajetMessage: string = '';
  // isModalVisible = false;
  trajet: any;
  isDialogOpen = false;
  isSecondDialogOpen = false;
  isChildForm = false; 
  reservation: NoconectModel = {};
  formData: NoconectModel = {
    prenom: '',
    nom: '',
    numero_registre: '',
    age: undefined,
    nationnalite: '',
    telephone: '',
    numero_identite: ''
  };


  ngOnInit(): void {
    this.fetchTrajets();
  }

  fetchTrajets() {
    this.trajetService.getAllTrajet().subscribe(
      (response: any) => {
        console.log(response.data);
        if (response.data) {
          this.tabtrajet = response.data;
          this.getActiveDepartureDates();
          this.getActiveDeparturePlaces();
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getActiveDepartureDates() {
    this.dateDepartOptions = this.tabtrajet
      .filter(trajet => trajet.statut === 1)
      .map(trajet => trajet.date_depart ? new Date(trajet.date_depart).toLocaleDateString() : '')
      .filter(date => date !== '');
  }

  getActiveDeparturePlaces() {
    this.lieuDepartOptions = this.tabtrajet
      .filter(trajet => trajet.statut === 1)
      .map(trajet => trajet.lieu_depart)
      .filter((lieu): lieu is string => !!lieu);
  }

  // Méthode pour afficher les trajets filtrés
  getDisplayedTrajets() {
    const filteredTrajets = this.tabtrajet.filter(trajet => {
      const dateDepart = trajet.date_depart ? new Date(trajet.date_depart).toLocaleDateString() : '';
      const matchesDate = this.selectedDate ? dateDepart === this.selectedDate : true;
      const matchesLieu = this.selectedLieuDepart ? trajet.lieu_depart === this.selectedLieuDepart : true;
      return trajet.statut === 1 && matchesDate && matchesLieu; // Filtrer par statut et critères
    });

    // Limiter à deux trajets distincts
    return filteredTrajets.slice(0, 2);
  }

  filterTrajets() {
    const displayedTrajets = this.getDisplayedTrajets();

    if (displayedTrajets.length === 0) {
      this.noTrajetMessage = 'Trajet indisponible'; // Message d'absence
      console.log('Aucun trajet trouvé pour les critères sélectionnés.');
    } else {
      this.noTrajetMessage = ''; // Reset du message
      console.log(`Nombre de trajets trouvés : ${displayedTrajets.length}`);
    }
  }

  navigateToReservation(trajetId: any) {
    this.router.navigate([`/reservation/${trajetId}`]);
  }

  setPage(page: string) {
    this.currentPage = page;
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }



  openDialog(trajetId: any){
    this.trajet = { id: trajetId };  
    this.isDialogOpen = true;
  }

  closeDialog(): void {
    this.isDialogOpen = false;
  }
  reserverPourMoi(trajetId:any): void {
    this.isDialogOpen = false;
  this.router.navigate(['/reservation', trajetId]);  // Rediriger vers la page de réservation
}

closeSecondDialog(): void {
  this.isSecondDialogOpen = false;
}



onAgeChange(): void {
  this.isChildForm = (this.formData.age ?? 0) >= 4 && (this.formData.age ?? 0) <= 12;
}



submitForm(trajetId:any): void {
  if (!this.trajet) {
    console.error('Le trajetId est indéfini');
    return;
  }

  // Stocke les données du formulaire dans le service
  this.reservationService.setFormData(this.formData);

  // Appelle la méthode de navigation pour rediriger vers la page de réservation
  this.router.navigate(['/Autrereservation', trajetId]);  // Rediriger vers la page de réservation
}


  reserverPourAutre(trajetId:any): void {
    this.isDialogOpen = false;
    this.trajet = { id: trajetId };  

    this.isSecondDialogOpen = true;
    // Logique pour "réserver pour un autre"
    console.log("Réserver pour un autre");
  }


  
 



}



