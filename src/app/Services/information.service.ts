import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { apiUrl } from './apiUrl';


@Injectable({
  providedIn: 'root'
})
export class InformationService {
  private http =inject(HttpClient);
//   creer une information
  createInformation(information:any){
    return this.http.post(`${apiUrl}/informations`,information);
}

// affichage
getAllInformations(){
    return this.http.get(`${apiUrl}/informations`);


}

deleteInformation(id: any) {
    return this.http.delete(`${apiUrl}/informations/${id}`);
}

}