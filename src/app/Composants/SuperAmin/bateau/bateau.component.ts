import { Component, inject, OnInit } from '@angular/core';
import { BateauService } from '../../../Services/bateau.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { BateauModel } from '../../Admin/bateau.model';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bateau',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './bateau.component.html',
  styleUrl: './bateau.component.css'
})
export class BateauComponent  implements OnInit{
  private bateauService = inject(BateauService);
  private router = inject(Router);
  private userService = inject(AuthService)
  bateauObject:BateauModel = {};
  tabBateaux:BateauModel[] =[];
  errorMessage: string = '';
  isModalOpen = false;
  currentPage: number = 1;
  itemsPerPage: number = 9;
  ngOnInit(): void {
    this.fetchBateaux();
      
  }

  // liste des bateau
  // fetchInformations(){
  //   this.bateauService.getAllBateaux().subscribe(
  //     (response:any)=>{
  //       console.log(response.data);

  //       if(response.data){
  //         this.tabInformation = response.data;
  //       }
        
  //     },(error:any)=>{
  //       console.log(error);
  //     }
  //   )

  // }

  fetchBateaux() {
    this.bateauService.getAllBateaux().subscribe(
      (response: any) => {
        console.log(response.data);
  
        if (response.data) {
          // Ajouter la propriété showFullDescription à chaque bateau
          this.tabBateaux = response.data.map((bateau: any) => {
            return {
              ...bateau,
              showFullDescription: false // Par défaut, on affiche la description tronquée
            };
          });
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  

  changeStatut(bateauId: any, currentStatut: any) {
    const newStatut = currentStatut === 1 ? 0 : 1; // Inverser le statut
    this.bateauService.updateBateauStatut(bateauId, newStatut).subscribe(
      (response: any) => {
        console.log(response.message); // Afficher un message de succès si nécessaire
        this.fetchBateaux(); // Recharger les informations
      },
      (error: any) => {
        console.error('Erreur lors de la mise à jour du statut :', error);
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


  editBateau(id:any){

  }

  // supprssion
 

  deleteBateau(id: any) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce trajet ?")) {
      this.bateauService.deleteBateau(id).subscribe(
        (response: any) => {
          console.log('Trajet supprimé', response);
          
        },
        (error: any) => {
          console.error('Erreur lors de la suppression de l\'information', error);
        }
      );
    }}

    // ajout

    ajoutBateau() {
      let formdata = new FormData();
  
      if (this.bateauObject.libelle && this.bateauObject.description) {
        formdata.append("libelle", this.bateauObject.libelle);
        formdata.append("description", this.bateauObject.description);
  
        this.bateauService.createBateau(formdata).subscribe(
          (response: any) => {
            console.log(response);
            if (response.data) {
              this.bateauObject = {}; // Réinitialiser le formulaire
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
}
