

import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { UserModel } from '../user.model';
import { CommonModule } from '@angular/common'; // Importer si vous avez besoin de directives comme ngIf, ngFor
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule,FormsModule], // Ajouter CommonModule si vous utilisez des directives comme ngIf
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'] // Correction de 'styleUrl' en 'styleUrls'
})
export class ProfilComponent implements OnInit {

  private authService = inject(AuthService);

  userObject: UserModel = {}; // Initialiser à null pour indiquer l'absence de données au début

  ngOnInit(): void {
    this.fetchUserProfile(); // Correction du nom de la méthode pour être plus explicite
  }

  fetchUserProfile() {
    this.authService.profil().subscribe(
      (response: any) => {
        console.log(response); // Inspecter la structure de la réponse
        this.userObject = response.user || response; // Si la donnée est directement dans response
      },
      (error: any) => {
        console.log('Erreur de récupération du profil:', error);
      }
    );
  }
  
}
