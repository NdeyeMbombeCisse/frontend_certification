import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-dashboad-admin',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboad-admin.component.html',
  styleUrl: './dashboad-admin.component.css'
})
export class DashboadAdminComponent {
  private router = inject(Router);
  private userService = inject(AuthService)
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
}
