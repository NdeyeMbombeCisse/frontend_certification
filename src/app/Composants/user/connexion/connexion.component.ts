


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
  if(this.userObjet.email && this.userObjet.password){
    this.userService.login(this.userObjet).subscribe(
      (response:any)=>{
        console.log(response.token);
        if(response.token){
          localStorage.setItem("token", JSON.stringify(response.token));
            this.router.navigateByUrl("liste-projet-habitant")
          // verifie le role de l'utilisateur{}

        }
      }
    )
  }

}

logout(): void {
  this.userService.logout();
}


}


