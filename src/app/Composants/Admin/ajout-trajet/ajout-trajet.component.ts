

// import { Component, inject } from '@angular/core';
// import { TrajetService } from '../../../Services/trajet.service';
// import { TrajetModel } from '../trajet.model';
// import { storageUrl } from '../../../Services/apiUrl';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { BateauModel } from '../bateau.model';
// import { Router, RouterModule } from '@angular/router';
// import { HttpErrorResponse } from '@angular/common/http';
// import { AuthService } from '../../../Services/auth.service';
// import Swal from 'sweetalert2';


// @Component({
//   selector: 'app-ajout-trajet',
//   standalone: true,
//   imports: [FormsModule,CommonModule,RouterModule],
//   templateUrl: './ajout-trajet.component.html',
//   styleUrl: './ajout-trajet.component.css'
// })
// export class AjoutTrajetComponent {

//   private trajetService = inject(TrajetService);
//   private userService = inject(AuthService);
//   errors: { [key: string]: string } = {};


//   // declaration des variables
//   tabtrajet:TrajetModel[]=[];
//   trajetObject:TrajetModel = {};
//   tabBateaux:BateauModel[] =[];
//   imageStorage:any= storageUrl;
//   private router= inject(Router);


//   // declaration des methodes
//   ngOnInit(): void {
//     this.fetchBateaux();

//   }

//   fetchBateaux(){
//     this.trajetService.getAllBateaux().subscribe(
//       (response:any)=>{
//         console.log(response.data);
//         if(response.data){
//           this.tabBateaux = response.data;
//         } 
//       },(error:any)=>{
//         console.log(error);
//       }
//     )
//   }


//   uploadImage(event:any){
//     console.log(event.target.files[0]);
//     this.trajetObject.image = event.target.files[0]
    
//     this.trajetObject.image = event.target.files[0] 
//   }
//   // methode pour la gestion de l'ajout
//   saveTrajet() {
//     let formdata = new FormData();

//     // Convertir les valeurs Date en chaînes
//     const dateDepartString = this.trajetObject.date_depart instanceof Date
//       ? this.trajetObject.date_depart.toISOString()
//       : this.trajetObject.date_depart;

//     const dateArriveeString = this.trajetObject.date_arrivee instanceof Date
//       ? this.trajetObject.date_arrivee.toISOString()
//       : this.trajetObject.date_arrivee;

//     // Convertir le boolean en chaîne
//     const statutString = this.trajetObject.statut ? '0' : '1';

//     if (
//       dateDepartString &&
//       dateArriveeString &&
//       this.trajetObject.lieu_depart &&
//       this.trajetObject.lieu_arrive &&
//       this.trajetObject.image &&
//       statutString && // Utiliser la version chaîne du boolean
//       this.trajetObject.heure_embarquement &&
//       this.trajetObject.heure_depart &&
//       this.trajetObject.bateau_id
//     ) {
//       formdata.append("date_depart", dateDepartString);
//       formdata.append("date_arrivee", dateArriveeString);
//       formdata.append("lieu_depart", this.trajetObject.lieu_depart);
//       formdata.append("lieu_arrive", this.trajetObject.lieu_arrive);
//       formdata.append("image", this.trajetObject.image);
//       formdata.append("statut", statutString); // Ajouter le boolean converti
//       formdata.append("heure_embarquement", this.trajetObject.heure_embarquement);
//       formdata.append("heure_depart", this.trajetObject.heure_depart);
//       formdata.append("bateau_id", this.trajetObject.bateau_id.toString());
//     }

//     this.trajetService.createTrajet(formdata).subscribe(
//       (response: any) => {
//         console.log(response);
//         if (response.data) {
//           this.trajetObject = {};
//         }
//       }
      
//     );
//   }




//   isActive(route: string): boolean {
//     return this.router.url === route;
//   }

//   logout(): void {
//     this.userService.logout().subscribe(
//       () => {
//         // Optionnel : Effacer les informations de l'utilisateur
//         localStorage.removeItem('token');
//         // Rediriger vers la page de connexion ou la page d'accueil
//         this.router.navigate(['/connexion']);
//       },
//       (error: HttpErrorResponse) => { // Spécifiez le type pour 'error'
//         console.error('Erreur de déconnexion', error);
//       }
//     );
//   }


  


  
// }


import { Component, inject } from '@angular/core';
import { TrajetService } from '../../../Services/trajet.service';
import { TrajetModel } from '../trajet.model';
import { storageUrl } from '../../../Services/apiUrl';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BateauModel } from '../bateau.model';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ajout-trajet',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './ajout-trajet.component.html',
  styleUrls: ['./ajout-trajet.component.css']
})
export class AjoutTrajetComponent {
  private trajetService = inject(TrajetService);
  private userService = inject(AuthService);
  private router = inject(Router);

  errors: { [key: string]: string } = {};
  tabtrajet: TrajetModel[] = [];
  trajetObject: TrajetModel = {};
  tabBateaux: BateauModel[] = [];
  imageStorage: any = storageUrl;

  ngOnInit(): void {
    this.fetchBateaux();
  }

  fetchBateaux() {
    this.trajetService.getAllBateaux().subscribe(
      (response: any) => {
        if (response.data) {
          this.tabBateaux = response.data;
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  uploadImage(event: any) {
    if (event.target.files.length > 0) {
      this.trajetObject.image = event.target.files[0];
    }
  }

  private isValidTrajet(): boolean {
    let isValid = true;
    this.errors = {};
    const currentDate = new Date();

    // Validation de la date de départ
    if (!this.trajetObject.date_depart) {
        this.errors['date_depart'] = 'La date de départ est obligatoire.';
        isValid = false;
    } else {
        const dateDepart = new Date(this.trajetObject.date_depart);
        if (isNaN(dateDepart.getTime())) { // Vérifie si la date est valide
            this.errors['date_depart'] = 'La date de départ est invalide.';
            isValid = false;
        } else if (dateDepart <= currentDate) {
            this.errors['date_depart'] = 'La date de départ doit être ultérieure à aujourd\'hui.';
            isValid = false;
        }
    }

    // Validation de la date d'arrivée
    if (!this.trajetObject.date_arrivee) {
        this.errors['date_arrivee'] = 'La date d\'arrivée est obligatoire.';
        isValid = false;
    } else {
        const dateArrivee = new Date(this.trajetObject.date_arrivee);
        if (isNaN(dateArrivee.getTime())) { // Vérifie si la date est valide
            this.errors['date_arrivee'] = 'La date d\'arrivée est invalide.';
            isValid = false;
        } else if (dateArrivee <= currentDate) {
            this.errors['date_arrivee'] = 'La date d\'arrivée doit être ultérieure à aujourd\'hui.';
            isValid = false;
        } else if (this.trajetObject.date_depart && dateArrivee <= new Date(this.trajetObject.date_depart)) {
            this.errors['date_arrivee'] = 'La date d\'arrivée doit être ultérieure à la date de départ.';
            isValid = false;
        }
    }

    // Validation du lieu d'arrivée
    if (!this.trajetObject.lieu_arrive || this.trajetObject.lieu_arrive.length > 50) {
        this.errors['lieu_arrive'] = 'Le lieu d\'arrivée est invalide (max 50 caractères).';
        isValid = false;
    }

    // Validation de l'image
    if (!this.trajetObject.image) {
        this.errors['image'] = 'L\'image est obligatoire.';
        isValid = false;
    }

    // Validation de l'heure d'embarquement
    if (!this.trajetObject.heure_embarquement) {
        this.errors['heure_embarquement'] = 'L\'heure d\'embarquement est obligatoire.';
        isValid = false;
    }

    // Validation de l'heure de départ
    if (!this.trajetObject.heure_depart) {
        this.errors['heure_depart'] = 'L\'heure de départ est obligatoire.';
        isValid = false;
    }

    // Validation du bateau
    if (!this.trajetObject.bateau_id) {
        this.errors['bateau_id'] = 'Le bateau est obligatoire.';
        isValid = false;
    }

    return isValid;
}



  saveTrajet() {
    if (!this.isValidTrajet()) {
      Swal.fire('Erreur', 'Veuillez corriger les erreurs dans le formulaire.', 'error');
      return;
    }

    let formdata = new FormData();
    const dateDepartString = this.trajetObject.date_depart instanceof Date
      ? this.trajetObject.date_depart.toISOString()
      : this.trajetObject.date_depart || '';
    const dateArriveeString = this.trajetObject.date_arrivee instanceof Date
      ? this.trajetObject.date_arrivee.toISOString()
      : this.trajetObject.date_arrivee || '';
    const statutString = this.trajetObject.statut ? '0' : '1';

    formdata.append("date_depart", dateDepartString);
    formdata.append("date_arrivee", dateArriveeString);
    formdata.append("lieu_depart", this.trajetObject.lieu_depart || '');
    formdata.append("lieu_arrive", this.trajetObject.lieu_arrive || '');
    formdata.append("image", this.trajetObject.image || new Blob()); // Ajoute un Blob vide par défaut si l'image est undefined
    formdata.append("statut", statutString);
    formdata.append("heure_embarquement", this.trajetObject.heure_embarquement || '');
    formdata.append("heure_depart", this.trajetObject.heure_depart || '');
    formdata.append("bateau_id", this.trajetObject.bateau_id ? this.trajetObject.bateau_id.toString() : '');

    this.trajetService.createTrajet(formdata).subscribe(
      (response: any) => {
        Swal.fire('Succès', 'Trajet ajouté avec succès!', 'success');
        this.trajetObject = {}; // Réinitialiser le formulaire après succès
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Erreur', 'Une erreur est survenue lors de l\'ajout du trajet.', 'error');
      }
    );
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
}
