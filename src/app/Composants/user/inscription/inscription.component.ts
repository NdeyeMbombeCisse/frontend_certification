



import { Component, inject, Inject, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { UserModel } from '../user.model';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-inscription',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './inscription.component.html',
    styleUrl: './inscription.component.css'
  })
 
export class InscriptionComponent implements OnInit {
  private userService = inject(AuthService);
  private router = inject(Router);

  user: UserModel = {};
  selectedFile: File | null = null;
  isCollapsed = false;
  private localStorage = window.localStorage;


  ngOnInit() {
   
  }
  

  

  // Fonction pour gérer la sélection du fichier
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }


 
  ajoutUser() {
    if (this.isValidProject()) {
      const formData = new FormData();
      formData.append('prenom', this.user.prenom || '');
      formData.append('nom', this.user.nom || '');
      formData.append('numero_identite', this.user. numero_identite || '');
      formData.append('telephone', this.user.telephone || '');
      formData.append('email', this.user.email || '');
      formData.append('password', this.user.password || '');
      formData.append('nationnalite', this.user. nationnalite || '');
      const timestamp = this.user.timestamp ? this.user.timestamp.toISOString() : '';
      formData.append('timestamp', timestamp);
      
      // Ajouter l'image sélectionnée au FormData
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.userService.register(formData).subscribe(
        (response: any) => {
          console.log('Réponse du serveur:', response);
          if (response && response.id) {
            this.user = {}; // Réinitialiser les champs après la soumission
            this.selectedFile = null; // Réinitialiser le fichier sélectionné
          } else {
            console.error('Réponse du serveur ne contient pas `id`');
          }
        },
        (error: any) => {
          console.error('Erreur lors de la création de l\'utilisateur', error);
        }
      );
    } else {
      console.log('Tous les champs obligatoires ne sont pas remplis');
    }
  }

  private isValidProject(): boolean {
    return !!(
      this.user.prenom &&
      this.user.nom &&
      this.user.email &&
      this.user.password 
   );
  }
}