

// import { Component, inject } from '@angular/core';
// import { AuthService } from '../../../Services/auth.service';
// import { Router } from '@angular/router';
// import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; // Importer les classes nécessaires
// import { UserModel } from '../user.model';
// import Swal from 'sweetalert2';


// @Component({
//         selector: 'app-connexion',
//         standalone: true,
//         imports: [ReactiveFormsModule,FormsModule],
//         templateUrl: './connexion.component.html',
//         styleUrl: './connexion.component.css'
//       })
// export class ConnexionComponent {
//   private userService = inject(AuthService);
//   private router = inject(Router);
//   loginForm: FormGroup; // Déclarer le FormGroup
//   userObjet:UserModel = {}

//   constructor(private fb: FormBuilder) { // Injecter FormBuilder
//     // Initialiser le formulaire avec des contrôles et des validations
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required]]
//     });
//   }
//   connexion() {
//     if (this.loginForm.valid) {
//         console.log('Formulaire valide', this.loginForm.value);
//         this.userService.login(this.loginForm.value).subscribe(
//             (response: any) => {
//                 console.log('Réponse de l\'API:', response);
//                 if (response.access_token) {
//                     const token = response.access_token;
//                     localStorage.setItem("access_token", token);
//                     if (response.user) {
//                       localStorage.setItem("user_id", response.user.id.toString());
//                       localStorage.setItem("user_first_name", response.user.telephone); // Assurez-vous que le champ est correct
//                       localStorage.setItem("user_phone", response.user.prenom); // Assurez-vous que le champ est correct
//                   }
//                     // Vérifie si l'ID utilisateur est dans la réponse
//                     if (response.user_id) {
//                         localStorage.setItem('user_id', response.user_id.toString()); // Stocke l'ID utilisateur
//                     } else {
//                         console.error('Aucun ID utilisateur dans la réponse:', response); // Affiche la réponse pour débogage
//                     }
//                     Swal.fire({
//                         title: 'Succès!',
//                         text: 'Authentification faite  avec succès!',
//                         icon: 'success',
//                         confirmButtonText: 'OK'
//                       });
//                       if(response.role=="user"){
//                         this.router.navigate(['/historique_reservation']);


//                       }else if(response.role=="superAdmin"){
//                         this.router.navigate(['/dasbaord_Sadmin']);

//                       } else if(response.role=="admin"){
//                         this.router.navigate(['/dasbaord_admin']);

//                       }

//                 } else {
//                     console.error('Aucun token dans la réponse');
//                 }
//             },
//             (error: any) => {
//                 console.error('Erreur lors de la connexion:', error);
//             }
//         );
//     } else {
//         console.error('Le formulaire n\'est pas valide');
//     }
// }


// }


import { Component, inject } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule,CommonModule],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent {
  private userService = inject(AuthService);
  private router = inject(Router);
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Initialiser le formulaire avec des contrôles et des validations
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(7)]]
    });
  }

  // Méthode pour gérer la connexion
  connexion() {
    if (this.loginForm.valid) {
        this.userService.login(this.loginForm.value).subscribe(
            (response: any) => {
                if (response.access_token) {
                    localStorage.setItem("access_token", response.access_token);
                    if (response.user) {
                        localStorage.setItem("user_id", response.user.id.toString());
                        localStorage.setItem("user_first_name", response.user.telephone);
                        localStorage.setItem("user_phone", response.user.prenom);
                    }

                    Swal.fire({
                        title: 'Succès!',
                        text: 'Authentification réussie!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });

                    // Redirection selon le rôle de l'utilisateur
                    
                        if (response.role == "user") {
                            this.router.navigate(['/historique_reservation']);
                        } else if (response.role == "superAdmin") {
                            this.router.navigate(['/liste_bateau']);
                        } else if (response.role == "admin") {
                            this.router.navigate(['/dasbaord_admin']);
                        }else if (response.role == "vigile") {
                          this.router.navigate(['/sca']);
                      } else {
                            console.error('Rôle non reconnu:', response.role);
                        }
                    } else {
                        console.error('Aucun rôle dans la réponse');
                    
                }
            },
            (error: any) => {
                Swal.fire('Erreur', 'Une erreur est survenue lors de la connexion', 'error');
            }
        );
    } else {
        this.displayFormErrors();
    }
}


  // Méthode pour afficher les erreurs
  displayFormErrors() {
    if (this.loginForm.get('email')?.hasError('required')) {
      Swal.fire('Erreur', 'L\'email est obligatoire', 'error');
    } else if (this.loginForm.get('email')?.hasError('email')) {
      Swal.fire('Erreur', 'L\'email n\'est pas valide', 'error');
    }

    if (this.loginForm.get('password')?.hasError('required')) {
      Swal.fire('Erreur', 'Le mot de passe est obligatoire', 'error');
    } else if (this.loginForm.get('password')?.hasError('minlength')) {
      Swal.fire('Erreur', 'Le mot de passe doit contenir au moins 7 caractères', 'error');
    }
  }
}
