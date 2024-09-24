import { Component, inject } from '@angular/core';
import { TrajetService } from '../../../Services/trajet.service';
import { TrajetModel } from '../trajet.model';
import { storageUrl } from '../../../Services/apiUrl';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ajout-trajet',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ajout-trajet.component.html',
  styleUrl: './ajout-trajet.component.css'
})
export class AjoutTrajetComponent {

  private trajetService = inject(TrajetService);

  // declaration des variables
  tabtrajet:TrajetModel[]=[];
  trajetObject:TrajetModel = {};
  imageStorage:any= storageUrl;

  // declaration des methodes
  ngOnInit(): void {
   
  }

  

  uploadImage(event:any){
    console.log(event.target.files[0]);
    this.trajetObject.image = event.target.files[0]
    
  }

  // methode pour la gestion de l'ajout
  ajoutLivre() {
    let formdata = new FormData();
  
    // Convertir les valeurs Date en chaînes
    const dateDepartString = this.trajetObject.date_depart instanceof Date
      ? this.trajetObject.date_depart.toISOString()
      : this.trajetObject.date_depart;
  
    const dateArriveeString = this.trajetObject.date_arrivee instanceof Date
      ? this.trajetObject.date_arrivee.toISOString()
      : this.trajetObject.date_arrivee;
  
    // Convertir le boolean en chaîne
    const statutString = this.trajetObject.statut ? '0' : '1';
  
    if (
      dateDepartString &&
      dateArriveeString &&
      this.trajetObject.lieu_depart &&
      this.trajetObject.lieu_arrive &&
      this.trajetObject.image &&
      statutString && // Utiliser la version chaîne du boolean
      this.trajetObject.heure_embarquement &&
      this.trajetObject.heure_depart &&
      this.trajetObject.bateau_id
    ) {
      formdata.append("date_depart", dateDepartString);
      formdata.append("date_arrivee", dateArriveeString);
      formdata.append("lieu_depart", this.trajetObject.lieu_depart);
      formdata.append("lieu_arrive", this.trajetObject.lieu_arrive);
      formdata.append("image", this.trajetObject.image);
      formdata.append("statut", statutString); // Ajouter le boolean converti
      formdata.append("heure_embarquement", this.trajetObject.heure_embarquement);
      formdata.append("heure_depart", this.trajetObject.heure_depart);
      formdata.append("bateau_id", this.trajetObject.bateau_id);
    }
  
    this.trajetService.createTrajet(formdata).subscribe(
      (response: any) => {
        console.log(response);
        if (response.data) {
          this.trajetObject = {};
        }
      }
    );
  }
  
  
  


}
