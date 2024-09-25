// // import { Component, OnInit } from '@angular/core';
// // import { ActivatedRoute, Router } from '@angular/router';
// // @Component({
// //   selector: 'app-modifier-trajet',
// //   templateUrl: './modifier-trajet.component.html',
// //   styleUrls: ['./modifier-trajet.component.css']
// // })
// // export class ModifierTrajetComponent implements OnInit {

// //   ngOnInit(): void {
      
// //   }
// // }

// import { Component, inject } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { TrajetService } from '../../../Services/trajet.service';
// import { TrajetModel } from '../trajet.model';
// import { BateauModel } from '../bateau.model';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { storageUrl } from '../../../Services/apiUrl';

// @Component({
//   selector: 'app-modifier-trajet',
//   standalone: true,
//   imports: [FormsModule, CommonModule],
//   templateUrl: './modifier-trajet.component.html',
//   styleUrls: ['./modifier-trajet.component.css']
// })
// export class ModifierTrajetComponent {
//   private trajetService = inject(TrajetService);
//   private route = inject(ActivatedRoute);
//   private router = inject(Router);

//   trajetObject: TrajetModel = {};
//   tabBateaux: BateauModel[] = [];
//   imageStorage: any = storageUrl;

//   ngOnInit(): void {
//     this.fetchBateaux();
//     this.fetchTrajet();
//   }

//   fetchBateaux() {
//     this.trajetService.getAllBateaux().subscribe(
//       (response: any) => {
//         if (response.data) {
//           this.tabBateaux = response.data;
//         }
//       },
//       (error: any) => {
//         console.log(error);
//       }
//     );
//   }

//   fetchTrajet() {
//     const trajetId = this.route.snapshot.paramMap.get('id'); // Get the trajet ID from the route
//     if (trajetId) {
//       this.trajetService.getTrajetById(trajetId).subscribe(
//         (response: any) => {
//           this.trajetObject = response.data; // Populate the trajetObject with existing data
//         },
//         (error: any) => {
//           console.log(error);
//         }
//       );
//     }
//   }

//   uploadImage(event: any) {
//     this.trajetObject.image = event.target.files[0]; // Set the new image
//   }

//   // Method for saving the modified trajet
//   saveTrajet() {
//     let formdata = new FormData();

//     const dateDepartString = this.trajetObject.date_depart instanceof Date
//       ? this.trajetObject.date_depart.toISOString()
//       : this.trajetObject.date_depart;

//     const dateArriveeString = this.trajetObject.date_arrivee instanceof Date
//       ? this.trajetObject.date_arrivee.toISOString()
//       : this.trajetObject.date_arrivee;

//     if (
//       dateDepartString &&
//       dateArriveeString &&
//       this.trajetObject.lieu_depart &&
//       this.trajetObject.lieu_arrive &&
//       this.trajetObject.image &&
//       this.trajetObject.heure_embarquement &&
//       this.trajetObject.heure_depart &&
//       this.trajetObject.bateau_id
//     ) {
//       formdata.append("date_depart", dateDepartString);
//       formdata.append("date_arrivee", dateArriveeString);
//       formdata.append("lieu_depart", this.trajetObject.lieu_depart);
//       formdata.append("lieu_arrive", this.trajetObject.lieu_arrive);
//       formdata.append("image", this.trajetObject.image);
//       formdata.append("heure_embarquement", this.trajetObject.heure_embarquement);
//       formdata.append("heure_depart", this.trajetObject.heure_depart);
//       formdata.append("bateau_id", this.trajetObject.bateau_id.toString());

//       // Call the update service method
//       this.trajetService.updateTrajet(this.trajetObject.id, formdata).subscribe(
//         (response: any) => {
//           if (response.data) {
//             this.router.navigate(['/portail']); // Redirect after successful update
//           }
//         },
//         (error: any) => {
//           console.log(error);
//         }
//       );
//     }
//   }
// }


import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrajetService } from '../../../Services/trajet.service';
import { TrajetModel } from '../trajet.model';
import { BateauModel } from '../bateau.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { storageUrl } from '../../../Services/apiUrl';

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
  imageStorage: string = storageUrl; // Ensuring this is a string
  errorMessage: string = ''; 

  ngOnInit(): void {
    this.fetchBateaux();
    this.fetchTrajet();
  }

  fetchBateaux() {
    this.trajetService.getAllBateaux().subscribe(
      (response: any) => {
        if (response.data) {
          this.tabBateaux = response.data;
        }
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des bateaux:', error);
      }
    );
  }

  fetchTrajet() {
    const trajetId = this.route.snapshot.paramMap.get('id'); // Get the trajet ID from the route
    if (trajetId) {
      this.trajetService.getTrajetById(trajetId).subscribe(
        (response: any) => {
          this.trajetObject = response.data; // Populate the trajetObject with existing data
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
      this.trajetObject.image = file;  // Assurez-vous que `image` contient bien le fichier
      console.log('Image sélectionnée:', file);  // Ajoutez un log pour vérifier
    }}

  // saveTrajet() {
  //   let formdata = new FormData();

  //   // Vérification des propriétés avant l'envoi
  //   if (this.isFormValid()) {
  //     // Ajout des données au FormData avec vérification
  //     if (this.trajetObject.date_depart) {
  //       formdata.append("date_depart", this.trajetObject.date_depart.toString()); // Convert to string if it's a Date object
  //     }
  //     if (this.trajetObject.date_arrivee) {
  //       formdata.append("date_arrivee", this.trajetObject.date_arrivee.toString()); // Convert to string if it's a Date object
  //     }
  //     if (this.trajetObject.lieu_depart) {
  //       formdata.append("lieu_depart", this.trajetObject.lieu_depart);
  //     }
  //     if (this.trajetObject.lieu_arrive) {
  //       formdata.append("lieu_arrive", this.trajetObject.lieu_arrive);
  //     }
  //     if (this.trajetObject.image) {
  //       formdata.append("image", this.trajetObject.image);
  //     }
  //     if (this.trajetObject.heure_embarquement) {
  //       formdata.append("heure_embarquement", this.trajetObject.heure_embarquement);
  //     }
  //     if (this.trajetObject.heure_depart) {
  //       formdata.append("heure_depart", this.trajetObject.heure_depart);
  //     }
  //     if (this.trajetObject.bateau_id) {
  //       formdata.append("bateau_id", this.trajetObject.bateau_id.toString()); // Ensure bateau_id is a string
  //     }

  //     // Appel du service de mise à jour
  //     this.trajetService.updateTrajet(this.trajetObject.id, formdata).subscribe(
  //       (response: any) => {
  //         console.log('Réponse:', response);
  //         if (response.data) {
  //           this.router.navigate(['/portail']); // Redirect after successful update
  //         }
  //       },
  //       (error: any) => {
  //         console.error('Erreur lors de la mise à jour du trajet:', error);
  //       }
  //     );
  //   } else {
  //     console.warn('Le formulaire n\'est pas valide.');
  //   }
  // }

  saveTrajet() {
    let formdata = new FormData();
  
    if (this.isFormValid()) {
      formdata.append("date_depart", this.trajetObject.date_depart!.toString());
      formdata.append("date_arrivee", this.trajetObject.date_arrivee!.toString());
      formdata.append("lieu_depart", this.trajetObject.lieu_depart!);
      formdata.append("lieu_arrive", this.trajetObject.lieu_arrive!);
  
      if (this.trajetObject.image instanceof File) {
        formdata.append("image", this.trajetObject.image);  // Vérifiez que c'est bien un fichier
      }
  
      formdata.append("heure_embarquement", this.trajetObject.heure_embarquement!);
      formdata.append("heure_depart", this.trajetObject.heure_depart!);
      formdata.append("bateau_id", this.trajetObject.bateau_id!.toString());
  
      this.trajetService.updateTrajet(this.trajetObject.id, formdata).subscribe(
        (response: any) => {
          console.log('Réponse:', response);
          if (response.data) {
            this.router.navigate(['/portail']);
          }
        },
        (error: any) => {
          console.error('Erreur lors de la mise à jour du trajet:', error);
          this.errorMessage = 'Une erreur est survenue lors de la mise à jour du trajet. Veuillez réessayer.';  // Affichage d'un message d'erreur
        }
      );
    } else {
      this.errorMessage = 'Le formulaire n\'est pas valide. Veuillez vérifier les informations.';  // Erreur si le formulaire est invalide
      console.warn('Le formulaire n\'est pas valide.');
    }
  }

  // Validation du formulaire
  isFormValid(): boolean {
    return this.trajetObject.lieu_depart !== undefined &&
           this.trajetObject.lieu_arrive !== undefined &&
           this.trajetObject.date_depart !== undefined &&
           this.trajetObject.date_arrivee !== undefined &&
           this.trajetObject.bateau_id !== undefined;
  }
}

