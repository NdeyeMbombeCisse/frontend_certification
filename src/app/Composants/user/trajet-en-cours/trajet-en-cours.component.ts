


import { Component, inject, OnInit } from '@angular/core';
import { TrajetModel } from '../../Admin/trajet.model';
import { TrajetService } from '../../../Services/trajet.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NoconectModel } from '../autrereservation';
import { ReservationService } from '../../../Services/reservation.service';

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

  noconnect:NoconectModel ={};
  errors: any = {};



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

  // getActiveDepartureDates() {
  //   const availableDates = this.tabtrajet
  //   .filter(trajet => trajet.statut === 1)
  //   .map(trajet => trajet.date_depart ? new Date(trajet.date_depart) : null)
  //   .filter(date => date !== null) as Date[]; // Ensure the result is a Date[]

  //   this.dateDepartOptions = availableDates.map(date => date.toLocaleDateString());

  // }

  disableUnavailableDates(date: Date): string | undefined {
    const formattedDate = date.toLocaleDateString();
    return this.dateDepartOptions.includes(formattedDate) ? '' : 'disabled';
  }
  
  

  getActiveDeparturePlaces() {
    this.lieuDepartOptions = this.tabtrajet
      .filter(trajet => trajet.statut === 1)
      .map(trajet => trajet.lieu_depart)
      .filter((lieu): lieu is string => !!lieu);
  }

  // Méthode pour afficher les trajets filtrés
  // getDisplayedTrajets() {
  //   const filteredTrajets = this.tabtrajet.filter(trajet => {
  //     const dateDepart = trajet.date_depart ? new Date(trajet.date_depart).toLocaleDateString() : '';
  //     const matchesDate = this.selectedDate ? dateDepart === this.selectedDate : true;
  //     const matchesLieu = this.selectedLieuDepart ? trajet.lieu_depart === this.selectedLieuDepart : true;
  //     return trajet.statut === 1 && matchesDate && matchesLieu; // Filtrer par statut et critères
  //   });

  //   // Limiter à deux trajets distincts
  //   return filteredTrajets.slice(0, 2);
  // }

  getDisplayedTrajets() {
    const filteredTrajets = this.tabtrajet.filter(trajet => {
      const dateDepart = trajet.date_depart ? new Date(trajet.date_depart).toLocaleDateString() : '';
      const matchesDate = this.selectedDate ? dateDepart === this.selectedDate : true;
      const matchesLieu = this.selectedLieuDepart ? trajet.lieu_depart === this.selectedLieuDepart : true;
      const hasAvailableSeats = trajet.placesRestantes !== undefined && trajet.placesRestantes > 0; // Vérifie que placesRestantes n'est pas undefined et est > 0
      return trajet.statut === 1 && matchesDate && matchesLieu && hasAvailableSeats;
    });
  
    return filteredTrajets;
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



// submitForm(trajetId:any): void {
//   if (!this.trajet) {
//     console.error('Le trajetId est indéfini');
//     return;
//   }

//   // Stocke les données du formulaire dans le service
//   this.reservationService.setFormData(this.formData);

//   // Appelle la méthode de navigation pour rediriger vers la page de réservation
//   this.router.navigate(['/Autrereservation', trajetId]);  // Rediriger vers la page de réservation
// }


submitForm(trajetId: any): void {
  if (!trajetId) {
    console.error('Le trajetId est indéfini');
    return;
  }

  // Vérifier la validation avant de soumettre
  // if (!this.isValidProject()) {
  //   console.error('Les données du formulaire ne sont pas valides.');
  //   return;
  // }

  // Stocke les données du formulaire dans le service
  this.reservationService.setFormData(this.formData);

  // Redirige vers la page de réservation avec l'id du trajet
  this.router.navigate(['/Autrereservation', trajetId]);
}



  reserverPourAutre(trajetId:any): void {
    this.isDialogOpen = false;
    this.trajet = { id: trajetId };  

    this.isSecondDialogOpen = true;
    // Logique pour "réserver pour un autre"
    console.log("Réserver pour un autre");
  }



  private isValidProject(): boolean {
    let isValid = true;
  
    // Réinitialiser les erreurs avant chaque validation
    this.errors = {};
  
    // Valider le prénom (lettres uniquement, max 20 caractères)
    const nameRegex = /^[a-zA-Z]+$/; // Permet seulement des lettres
    if (!this.noconnect.prenom || this.noconnect.prenom.length > 20 || !nameRegex.test(this.noconnect.prenom)) {
      this.errors.prenom = 'Le prénom est invalide (max 20 lettres).';
      isValid = false;
    }
  
    // Valider le nom (lettres uniquement, max 20 caractères)
    if (!this.noconnect.nom || !nameRegex.test(this.noconnect.nom)) {
      this.errors.nom = 'Le nom est invalide (max 20 lettres).';
      isValid = false;
    }
  
    // Valider le numéro d'identité (exactement 13 chiffres)
    const idRegex = /^\d{13}$/;
    if (!this.noconnect.numero_identite || !idRegex.test(this.noconnect.numero_identite)) {
      this.errors.numero_identite = 'Le numéro d\'identité doit être exactement 13 chiffres.';
      isValid = false;
    }
  
    // Valider le téléphone (exactement 9 chiffres)
    const phoneRegex = /^(77|78|70|76)\d{7}$/;
    if (!this.noconnect.telephone || !phoneRegex.test(this.noconnect.telephone)) {
      this.errors.telephone = 'Le téléphone doit commencer par 77, 78, 70 ou 76 et contenir exactement 9 chiffres.';
      isValid = false;
    }
  
    // Valider l'email
    const registreRegex = /^\d{4}$/; // Exactement 4 chiffres
    if (!this.noconnect.numero_registre || !registreRegex.test(this.noconnect.numero_registre)) {
      this.errors.numero_registre = 'Le numéro de registre doit être composé de 4 chiffres.';
      isValid = false;
    }
  
    // Vérifier que l'âge est supérieur ou égal à 4
    if (!this.noconnect.age || this.noconnect.age < 4) {
      this.errors.age = 'L\'âge doit être supérieur ou égal à 4.';
      isValid = false;
    }
    
  
    // Vérifier que tous les champs obligatoires sont remplis (y compris la nationalité)
    if (!this.noconnect.nationnalite) {
      this.errors.nationnalite = 'La nationalité est obligatoire.';
      isValid = false;
    }
  
    return isValid;
  }
  
  
 



}






