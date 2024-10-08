
import { Component, inject, OnInit } from '@angular/core';
import { InformationService } from '../../../Services/information.service';
import { InformationModel } from '../information.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-information',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {
  private informationService = inject(InformationService);
  private router = inject(Router);
  private userService = inject(AuthService);
  informationObject: InformationModel = {};
  tabInformation: InformationModel[] = [];
  errorMessage: string = '';
  isModalOpen = false;
  currentPage: number = 1;
  itemsPerPage: number = 9;
  informationId: string | null = null;

  ngOnInit(): void {
    this.fetchInformations();
  }

  ajoutInformation() {
    let formdata = new FormData();

    if (this.informationObject.titre && this.informationObject.description) {
      formdata.append("titre", this.informationObject.titre);
      formdata.append("description", this.informationObject.description);

      if (this.informationId) {
        // Update Information
        this.informationService.updateInformation(this.informationId, formdata).subscribe(
          (response: any) => {
            this.fetchInformations(); // Refresh table data
            this.informationObject = {};
            this.informationId = null;
            this.closeModal();
            Swal.fire('Succès', 'Information modifiée avec succès', 'success');
          },
          (error:any) => {
            console.error(error);
            this.errorMessage = 'Erreur lors de la modification de l\'information';
          }
        );
      } else {
        // Add New Information
        this.informationService.createInformation(formdata).subscribe(
          (response: any) => {
            this.fetchInformations(); // Refresh table data
            this.informationObject = {};
            this.errorMessage = '';
            this.closeModal();
            Swal.fire('Succès', 'Information ajoutée avec succès', 'success');
          },
          (error) => {
            console.error(error);
            this.errorMessage = 'Erreur lors de l\'ajout de l\'information';
          }
        );
      }
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs';
    }
  }

  fetchInformations() {
    this.informationService.getAllInformations().subscribe(
      (response: any) => {
        if (response.data) {
          this.tabInformation = response.data;
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  // Edit information
  editInformation(id: any) {
    const information = this.tabInformation.find(info => info.id === id);
    if (information) {
      this.informationObject = { ...information };
      this.informationId = id;
      this.openModal();
    }
  }

  // Delete information
  deleteInformation(id: any) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.informationService.deleteInformation(id).subscribe(
          (response: any) => {
            this.fetchInformations(); // Refresh table data
            Swal.fire('Supprimé!', 'L\'information a été supprimée.', 'success');
          },
          (error: any) => {
            console.error('Erreur lors de la suppression de l\'information', error);
          }
        );
      }
    });
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  logout(): void {
    this.userService.logout().subscribe(
      () => {
        localStorage.removeItem('token');
        this.router.navigate(['/connexion']);
      },
      (error: HttpErrorResponse) => {
        console.error('Erreur de déconnexion', error);
      }
    );
  }

  // Modal controls
  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.informationObject = {};
    this.informationId = null;
  }

  // Pagination methods
  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getDisplayedTrajets(): InformationModel[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.tabInformation.slice(startIndex, startIndex + this.itemsPerPage);
  }

  getTotalPages() {
    return Math.ceil(this.tabInformation.length / this.itemsPerPage);
  }
}
