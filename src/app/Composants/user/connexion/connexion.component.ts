


// import { Component, inject } from '@angular/core';
// import { AuthService } from '../../../Services/auth.service';
// import { Router } from '@angular/router';
// import { UserModel } from '../user.model';
// import { FormsModule } from '@angular/forms';

// @Component({
//     selector: 'app-connexion',
//     standalone: true,
//     imports: [FormsModule],
//     templateUrl: './connexion.component.html',
//     styleUrl: './connexion.component.css'
//   })
// export class ConnexionComponent{

// // injection des dependences

// private userService = inject(AuthService);

// private router = inject(Router);

// userObjet:UserModel = {}



// connexion(){
//   console.log(this.userObjet);
//   if (this.userObjet.email && this.userObjet.password) {
//     this.userService.login(this.userObjet).subscribe(
//       (response: any) => {
//         // Log pour voir toute la structure de la réponse
//         console.log('Response structure:', response);

//         // Vérifie si le token est directement dans response ou dans une autre structure
//         if (response.token) {
//           console.log('Token:', response.token);
//           localStorage.setItem("token", response.token);
//           this.router.navigate(['/ajoutReservation']);
//         } else if (response.data && response.data.token) { // Si le token est dans data
//           console.log('Token in data:', response.data.token);
//           localStorage.setItem("token", response.data.token);
//           this.router.navigate(['/inscription_user']);
//         } else {
//           console.error('No token in the response');
//         }
//       },
//       (error: any) => {
//         console.error('Error during login:', error);
//       }
//     );
//   }
// }







// logout(): void {
//   this.userService.logout();
// }


// }



// import { Component, inject } from '@angular/core';
// import { AuthService } from '../../../Services/auth.service';
// import { Router } from '@angular/router';
// import { UserModel } from '../user.model';
// import { FormsModule } from '@angular/forms';

// @Component({
//       selector: 'app-connexion',
//       standalone: true,
//       imports: [FormsModule],
//       templateUrl: './connexion.component.html',
//       styleUrl: './connexion.component.css'
//     })
// export class ConnexionComponent{
//   private userService = inject(AuthService);

//   private router = inject(Router);
  
//   userObjet:UserModel = {}


//   connexion() {
//     console.log('Début de la méthode connexion');
//     console.log(this.userObjet);
  
//     if (this.userObjet.email && this.userObjet.password) {
//       console.log('Email et mot de passe fournis');
  
//       this.userService.login(this.userObjet).subscribe(
//         (response: any) => {
//           console.log('Réponse de l\'API:', response);
  
//           // Vérifiez si le access_token est présent dans la réponse
//           if (response.access_token) {
//             const token = response.access_token; // Extraire le access_token
//             console.log('Token:', token);
            
//             // Enregistrer le token dans le localStorage
//             localStorage.setItem("access_token", token);
            
//             // Redirection après la connexion
//             this.router.navigate(['/ajoutReservation']);
//           } else {
//             console.error('Aucun token dans la réponse');
//           }
//         },
//         (error: any) => {
//           console.error('Erreur lors de la connexion:', error);
//         }
//       );
//     } else {
//       console.error('Email et mot de passe sont requis');
//     }
//   }
  
  
  
  
// }

import { Component, inject } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Importer les classes nécessaires

@Component({
        selector: 'app-connexion',
        standalone: true,
        imports: [ReactiveFormsModule],
        templateUrl: './connexion.component.html',
        styleUrl: './connexion.component.css'
      })
export class ConnexionComponent {
  private userService = inject(AuthService);
  private router = inject(Router);
  loginForm: FormGroup; // Déclarer le FormGroup

  constructor(private fb: FormBuilder) { // Injecter FormBuilder
    // Initialiser le formulaire avec des contrôles et des validations
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
  connexion() {
    if (this.loginForm.valid) {
        console.log('Formulaire valide', this.loginForm.value);
        this.userService.login(this.loginForm.value).subscribe(
            (response: any) => {
                console.log('Réponse de l\'API:', response);
                if (response.access_token) {
                    const token = response.access_token;
                    localStorage.setItem("access_token", token);
                    if (response.user) {
                      localStorage.setItem("user_id", response.user.id.toString());
                      localStorage.setItem("user_first_name", response.user.telephone); // Assurez-vous que le champ est correct
                      localStorage.setItem("user_phone", response.user.prenom); // Assurez-vous que le champ est correct
                  }
                    // Vérifie si l'ID utilisateur est dans la réponse
                    if (response.user_id) {
                        localStorage.setItem('user_id', response.user_id.toString()); // Stocke l'ID utilisateur
                    } else {
                        console.error('Aucun ID utilisateur dans la réponse:', response); // Affiche la réponse pour débogage
                    }

                    this.router.navigate(['/ajoutReservation']);
                } else {
                    console.error('Aucun token dans la réponse');
                }
            },
            (error: any) => {
                console.error('Erreur lors de la connexion:', error);
            }
        );
    } else {
        console.error('Le formulaire n\'est pas valide');
    }
}


}
