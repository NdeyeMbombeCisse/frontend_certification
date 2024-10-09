

import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { UserModel } from '../user.model';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent implements OnInit {
  private userService = inject(AuthService);
  private router = inject(Router);

  user: UserModel = {};
  selectedFile: File | null = null;
  isCollapsed = false;
  errors: any = {};

  ngOnInit() {}

  // Fonction pour gérer la sélection du fichier
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  ajoutUser() {
    // Valider le formulaire avant d'envoyer les données
    this.errors = {}; // Réinitialiser les erreurs à chaque tentative
    if (this.isValidProject()) {
      const formData = new FormData();
      formData.append('prenom', this.user.prenom || '');
      formData.append('nom', this.user.nom || '');
      formData.append('numero_identite', this.user.numero_identite || '');
      formData.append('telephone', this.user.telephone || '');
      formData.append('email', this.user.email || '');
      formData.append('password', this.user.password || '');
      formData.append('nationnalite', this.user.nationnalite || '');
      
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.userService.register(formData).subscribe(
        (response: any) => {
          Swal.fire({
            title: 'Succès!',
            text: 'Utilisateur créé avec succès!',
            icon: 'success',
            confirmButtonText: 'OK'
          });

          this.user = {}; // Réinitialiser les champs après la soumission
          this.selectedFile = null; // Réinitialiser le fichier sélectionné
          this.router.navigate(['connexion']);

        },
        (error: any) => {
          console.error('Erreur lors de la création de l\'utilisateur', error);
        }
      );
    } else {
      Swal.fire({
        title: 'Erreur!',
        text: 'Vérifiez les champs avant de soumettre.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  // Validation des données du formulaire
  private isValidProject(): boolean {
    let isValid = true;

    // Valider le prénom (lettres uniquement, max 20 caractères)
    const nameRegex = /^[a-zA-Z]+$/; // Permet seulement des lettres

    // Valider le prénom (lettres uniquement, max 20 caractères)
    if (!this.user.prenom || this.user.prenom.length > 20 ) {
      this.errors.prenom = 'Le prénom est invalide (max 20 lettres).';
      isValid = false;
    }

    // Valider le nom (lettres uniquement, max 20 caractères)
    if (!this.user.nom || !nameRegex.test(this.user.nom) ) {
      this.errors.nom = 'Le nom est invalide (max 20 lettres).';
      isValid = false;
    }

    // Valider le numéro d'identité (exactement 13 chiffres)
    const idRegex = /^\d{13}$/;
    if (!this.user.numero_identite || !idRegex.test(this.user.numero_identite)) {
      this.errors.numero_identite = 'Le numéro d\'identité doit être exactement 13 chiffres.';
      isValid = false;
    }


    // Valider le téléphone (exactement 9 chiffres)
    const phoneRegex = /^(77|78|70|76)\d{7}$/;
    if (!this.user.telephone || !phoneRegex.test(this.user.telephone)) {
      this.errors.telephone = 'Le téléphone doit commencer par 77, 78, 70 ou 76 et contenir exactement 9 chiffres.';
      isValid = false;
    }

    // Valider l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.user.email || !emailRegex.test(this.user.email)) {
      this.errors.email = 'L\'email est invalide.';
      isValid = false;
    }

    // Valider le mot de passe (min 7 caractères)
    if (!this.user.password || this.user.password.length < 7) {
      this.errors.password = 'Le mot de passe doit avoir au moins 7 caractères.';
      isValid = false;
    }

    // Vérifier que tous les champs obligatoires sont remplis
    if (!this.user.nationnalite) {
      this.errors.nationnalite = 'La nationalité est obligatoire.';
      isValid = false;
    }

    return isValid;
  }
}


