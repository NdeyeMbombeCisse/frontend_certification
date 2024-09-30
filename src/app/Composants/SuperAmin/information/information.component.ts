// import { Component, inject } from '@angular/core';
// import { InformationService } from '../../../Services/information.service';
// import { InformationModel } from '../information.model';

// @Component({
//   selector: 'app-information',
//   standalone: true,
//   imports: [],
//   templateUrl: './information.component.html',
//   styleUrl: './information.component.css'
// })
// export class InformationComponent {
//   private informationService = inject(InformationService);
//   informationObject : InformationModel ={};
//   ajoutLivre(){
//     let formdata = new FormData();
//     if(this. informationObject.titre && this. informationObject.description ){
 
//      formdata.append("titre",this. informationObject.titre);
//      formdata.append("description",this.informationObject.description);
    
 
//     }
//     this.informationService.createInformation(formdata).subscribe(
//      (response:any)=>{
//        console.log(response);
//        if(response.data){
//          this.informationObject ={};
//        }
       
//      }
//     )
    
//    }
  
// }

import { Component, inject } from '@angular/core';
import { InformationService } from '../../../Services/information.service';
import { InformationModel } from '../information.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-information',
  standalone: true,
  imports: [FormsModule,FormsModule],
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css'] // Corrigé : "styleUrl" devient "styleUrls"
})
export class InformationComponent {
  private informationService = inject(InformationService);
  informationObject: InformationModel = {};
  errorMessage: string = '';

  ajoutInformation() {
    let formdata = new FormData();

    if (this.informationObject.titre && this.informationObject.description) {
      formdata.append("titre", this.informationObject.titre);
      formdata.append("description", this.informationObject.description);

      this.informationService.createInformation(formdata).subscribe(
        (response: any) => {
          console.log(response);
          if (response.data) {
            this.informationObject = {}; // Réinitialiser le formulaire
            this.errorMessage = ''; // Réinitialiser le message d'erreur
          }
        },
        (error) => {
          console.error(error);
          this.errorMessage = 'Erreur lors de l\'ajout de l\'information'; // Gérer les erreurs
        }
      );
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs'; // Message d'erreur pour les champs vides
    }
  }
}
