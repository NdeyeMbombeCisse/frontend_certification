import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { apiUrl } from "./apiUrl";
import { TrajetModel } from "../Composants/Admin/trajet.model";

@Injectable(
    {providedIn:'root'}
)

export class ReservationService{
    // injection de dependance
    private http = inject(HttpClient);

    // methode pour creer
    reserverTrajet(reservation:any){
        return this.http.post(`${apiUrl}/reservations`,reservation);
    }

    // // 1-methode recuperer la liste des livres
    // getAllTrajet(){
    //     return this.http.get(`${apiUrl}/trajets`);
    // }

   

    // getAllBateaux(){
    //     return this.http.get(`${apiUrl}/bateaux`);
    // }

    // // methode pour modifer un livre
    // updateTrajet(id:any,trajet:any){
    //     return this.http.put(`${apiUrl}/trajets/${id}`,trajet);
    // }

    // // methode pour la supprsion d'un livre
    // deleteTrajet(id: any) {
    //     return this.http.delete(`${apiUrl}/trajets/${id}`);
    // }

    // // changer le statut d'un trajet
    // updateStatutTrajet(id: number, statutData: { statut: boolean }) {
    //     return this.http.patch(`${apiUrl}/trajets/${id}/statut`, statutData);
    //   }

    // //   recuperer trajet pas id

    // getTrajetById(id:any){
    //     return this.http.get(`${apiUrl}/recupererTrajet/${id}`);
    // }

   
  
    }
      
      
      
      
      
      