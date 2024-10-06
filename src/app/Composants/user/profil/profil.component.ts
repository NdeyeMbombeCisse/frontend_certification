
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { UserModel } from '../user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);

  userObject: UserModel = {};
  isEditing = false; // Variable pour contrôler le mode édition

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  fetchUserProfile() {
    this.authService.profil().subscribe(
      (response: any) => {
        console.log(response);
        this.userObject = response.user || response;
      },
      (error: any) => {
        console.log('Erreur de récupération du profil:', error);
      }
    );
  }

  toggleEdit() {
    this.isEditing = !this.isEditing; // Bascule entre le mode lecture et édition
  }

  saveProfile() {
  const userId = this.userObject.id; // Assurez-vous que l'ID de l'utilisateur est bien défini dans userObject
  this.authService.updateProfile(this.userObject, userId).subscribe(
    (response: any) => {
      console.log('Profil mis à jour avec succès', response);
      this.isEditing = false; // Retour en mode lecture
    },
    (error: HttpErrorResponse) => {
      console.error('Erreur de mise à jour du profil', error);
    }
  );
}


  logout(): void {
    this.authService.logout().subscribe(
      () => {
        localStorage.removeItem('token');
        this.router.navigate(['/portail']);
      },
      (error: HttpErrorResponse) => {
        console.error('Erreur de déconnexion', error);
      }
    );
  }

  isActive(route: string): boolean {
        return this.router.url === route;
      }
    
      isMenuOpen = false;
    
      toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
      }
}
