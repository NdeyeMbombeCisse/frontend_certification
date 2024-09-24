


import { Component, inject } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { UserModel } from '../user.model';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-connexion',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './connexion.component.html',
    styleUrl: './connexion.component.css'
  })
export class ConnexionComponent{

// injection des dependences

private userService = inject(AuthService);

private router = inject(Router);

userObjet:UserModel = {}



connexion(){
  console.log(this.userObjet);
  if (this.userObjet.email && this.userObjet.password) {
    this.userService.login(this.userObjet).subscribe(
      (response: any) => {
        // Log pour voir toute la structure de la réponse
        console.log('Response structure:', response);

        // Vérifie si le token est directement dans response ou dans une autre structure
        if (response.token) {
          console.log('Token:', response.token);
          localStorage.setItem("token", response.token);
          this.router.navigateByUrl("portail");
        } else if (response.data && response.data.token) { // Si le token est dans data
          console.log('Token in data:', response.data.token);
          localStorage.setItem("token", response.data.token);
          this.router.navigateByUrl("portail");
        } else {
          console.error('No token in the response');
        }
      },
      (error: any) => {
        console.error('Error during login:', error);
      }
    );
  }
}







logout(): void {
  this.userService.logout();
}


}


