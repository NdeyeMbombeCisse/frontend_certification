import { Component, inject, OnInit } from '@angular/core';
import { BateauService } from '../../../Services/bateau.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { BateauModel } from '../../Admin/bateau.model';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';


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
  bateauId: string | null = null;

  currentPage: number = 1;
  itemsPerPage: number = 9;
  ngOnInit(): void {
    this.fetchBateaux();
      
  }



  fetchBateaux() {
    this.bateauService.getAllBateaux().subscribe(
      (response: any) => {
        console.log(response.data);
  
        if (response.data) {
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


 

  ajoutBateau() {
    let formdata = new FormData();

    // Vérification que le libelle et la description sont remplis
    if (this.bateauObject.libelle && this.bateauObject.description) {
        
        // Validation: le libelle ne doit pas contenir de chiffres
        const hasNumbers = /\d/;
        if (hasNumbers.test(this.bateauObject.libelle)) {
            this.errorMessage = 'Le titre ne doit pas contenir de chiffres';
            return; // Arrêter la fonction si la validation échoue
        }

        formdata.append("libelle", this.bateauObject.libelle);
        formdata.append("description", this.bateauObject.description);

        this.bateauService.createBateau(formdata).subscribe(
            (response: any) => {
                console.log(response);
                if (response.data) {
                    this.bateauObject = {}; // Réinitialiser le formulaire
                    this.errorMessage = ''; // Réinitialiser le message d'erreur
                    Swal.fire({
                        icon: 'success',
                        title: 'Ajout Réussi',
                        text: 'Le bateau a été ajouté avec succès!',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false
                    });
                    this.fetchBateaux(); // Rafraîchir la liste des bateaux après ajout
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

  deleteBateau(id: any) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Cette action est irréversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bateauService.deleteBateau(id).subscribe(
          (response: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Supprimé!',
              text: 'Le bateau a été supprimé avec succès.',
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false
            });
            this.fetchBateaux(); // Refresh the list
          },
          (error: any) => {
            console.error('Erreur lors de la suppression du bateau', error);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Une erreur est survenue lors de la suppression du bateau.'
            });
          }
        );
      }
    });
  }

  openModal(): void {
    this.isModalOpen = true;
  }
  editBateau(id:any){
    const bateau = this.tabBateaux.find(bateau => bateau.id === id);
    if(bateau){
      this.bateauObject = {...bateau};
      this.bateauId =id;
      this.openModal();

    }
  }

   
}



