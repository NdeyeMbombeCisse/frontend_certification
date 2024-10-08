import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { apiUrl } from './apiUrl';


@Injectable({
  providedIn: 'root'
})
export class BateauService {
  private http =inject(HttpClient);
//   creer une information
  createBateau(bateau:any){
    return this.http.post(`${apiUrl}/bateaux`,bateau);
}

// affichage
getAllBateaux(){
    return this.http.get(`${apiUrl}/bateaux`);


}

deleteBateau(id: any) {
    return this.http.delete(`${apiUrl}/bateaux/${id}`);
}

// changer le statut d'un bateau
updateBateauStatut(id: number, statut: number) {
    return this.http.put(`${apiUrl}/bateaux/${id}/statut`, { statut });
  }

  updateBateau(id:any,bateau:any){
    return this.http.put(`${apiUrl}/bateaux/${id}`, bateau);

  }

}