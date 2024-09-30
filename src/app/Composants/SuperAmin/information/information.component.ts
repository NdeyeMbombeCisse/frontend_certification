
import { Component, inject, OnInit } from '@angular/core';
import { InformationService } from '../../../Services/information.service';
import { InformationModel } from '../information.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-information',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css'] // Corrigé : "styleUrl" devient "styleUrls"
})
export class InformationComponent implements OnInit {
  private informationService = inject(InformationService);
  private router = inject(Router);
  private userService = inject(AuthService)
  informationObject: InformationModel = {};
  tabInformation:InformationModel[] =[];
  errorMessage: string = '';
  isModalOpen = false;
  currentPage: number = 1;
  itemsPerPage: number = 9;

  ngOnInit(): void {
      this.fetchInformations();
  }

  ajoutInformation() {
    let formdata = new FormData();

    if (this.informationObject.titre && this.informationObject.description) {
      formdata.append("titre", this.informationObject.titre);
      formdata.append("description", this.informationObject.description);

      this.informationService.createInformation(formdata).subscribe(
        (response: any) => {
          console.log(response);
          if (response.data) {
            this.informationObject = {}; // Réinitialiser le formulaire
            this.errorMessage = ''; // Réinitialiser le message d'erreur
          }
        },
        (error) => {
          console.error(error);
          this.errorMessage = 'Erreur lors de l\'ajout de l\'information'; // Gérer les erreurs
        }
      );
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs'; // Message d'erreur pour les champs vides
    }
  }

  fetchInformations(){
    this.informationService.getAllInformations().subscribe(
      (response:any)=>{
        console.log(response.data);

        if(response.data){
          this.tabInformation = response.data;
        }
        
      },(error:any)=>{
        console.log(error);
      }
    )

  }

  // modifier
  editInformation(id:any){

  }

  // supprssion
 

  deleteInformation(id: any) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce trajet ?")) {
      this.informationService.deleteInformation(id).subscribe(
        (response: any) => {
          console.log('Trajet supprimé', response);
          
        },
        (error: any) => {
          console.error('Erreur lors de la suppression de l\'information', error);
        }
      );
    }}

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
    // popup
    openModal(): void {
      this.isModalOpen = true; // Ouvrir le modal
    }
  
    closeModal(): void {
      this.isModalOpen = false; // Fermer le modal
    }
  
    // pagination
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

  getDisplayedTrajets(): InformationModel[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.tabInformation.slice(startIndex, startIndex + this.itemsPerPage);
}

  getTotalPages() {
    return Math.ceil(this.tabInformation.length / this.itemsPerPage);
  }

}
