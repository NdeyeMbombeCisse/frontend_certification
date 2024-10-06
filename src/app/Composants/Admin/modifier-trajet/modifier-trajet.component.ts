


import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrajetService } from '../../../Services/trajet.service';
import { TrajetModel } from '../trajet.model';
import { BateauModel } from '../bateau.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { storageUrl } from '../../../Services/apiUrl';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-modifier-trajet',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './modifier-trajet.component.html',
  styleUrls: ['./modifier-trajet.component.css']
})
export class ModifierTrajetComponent implements OnInit {
  private trajetService = inject(TrajetService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  trajetObject: TrajetModel = {};
  tabBateaux: BateauModel[] = [];
  imageStorage: string = storageUrl;
  errorMessage: string = ''; 

  ngOnInit(): void {
    this.fetchBateaux();
    this.fetchTrajet();
  }

  fetchBateaux() {
    this.trajetService.getAllBateaux().subscribe(
      (response: any) => {
        this.tabBateaux = response.data || [];
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des bateaux:', error);
      }
    );
  }

  fetchTrajet() {
    const trajetId = this.route.snapshot.paramMap.get('id');
    if (trajetId) {
      this.trajetService.getTrajetById(+trajetId).subscribe(
        (response: any) => {
          this.trajetObject = response.data;
        },
        (error: any) => {
          console.error('Erreur lors de la récupération du trajet:', error);
        }
      );
    }
  }

  uploadImage(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.trajetObject.image = file; // Assurez-vous que `image` contient bien le fichier
      console.log('Image sélectionnée:', file);
    }
  }
  

  saveTrajet() {
    console.log("Début de la sauvegarde du trajet"); // Vérification de l'appel
  
    const formdata = new FormData();
    
    if (this.isFormValid()) {
      console.log("Le formulaire est valide"); // Vérification de la validation
  
      const dateDepart = this.trajetObject.date_depart instanceof Date ? 
        this.trajetObject.date_depart : new Date(this.trajetObject.date_depart!);
      const dateArrivee = this.trajetObject.date_arrivee instanceof Date ? 
        this.trajetObject.date_arrivee : new Date(this.trajetObject.date_arrivee!);
  
      formdata.append("date_depart", dateDepart.toISOString());
      formdata.append("date_arrivee", dateArrivee.toISOString());
      formdata.append("lieu_depart", this.trajetObject.lieu_depart!);
      formdata.append("lieu_arrive", this.trajetObject.lieu_arrive!);
  
      if (this.trajetObject.image instanceof File) {
        formdata.append("image", this.trajetObject.image);
        console.log("Image ajoutée au formulaire", this.trajetObject.image);
      }
  
      formdata.append("heure_embarquement", this.trajetObject.heure_embarquement!);
      formdata.append("heure_depart", this.trajetObject.heure_depart!);
      formdata.append("bateau_id", this.trajetObject.bateau_id!.toString());
  
      this.trajetService.updateTrajet(this.trajetObject.id, formdata).subscribe(
        (response: any) => {
          console.log('Réponse du serveur après la mise à jour:', response);
          Swal.fire({
            title: 'Modification réussie',
            text: 'Le trajet a été modifié avec succès. Détails: ' + JSON.stringify(response), // Détails de la réponse
            icon: 'success',
            confirmButtonText: 'Ok'
          });
          if (response.data) {
            this.router.navigate(['/portail']);
          }
        },
        (error: any) => {
          console.error('Erreur lors de la mise à jour du trajet:', error);
          this.errorMessage = 'Une erreur est survenue lors de la mise à jour du trajet. Veuillez réessayer.';
        }
      );
    } else {
      this.errorMessage = 'Le formulaire n\'est pas valide. Veuillez vérifier les informations.';
      console.warn('Le formulaire n\'est pas valide.');
    }
  }
  

  isFormValid(): boolean {
    return !!this.trajetObject.lieu_depart &&
           !!this.trajetObject.lieu_arrive &&
           !!this.trajetObject.date_depart &&
           !!this.trajetObject.date_arrivee &&
           !!this.trajetObject.bateau_id;
  }
}
