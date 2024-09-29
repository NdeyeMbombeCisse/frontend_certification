import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { apiUrl } from "./apiUrl";
import { map } from "rxjs";

@Injectable(
    {providedIn:'root'}
)

export class ReservationService{
    // injection de dependance
    private http = inject(HttpClient);

    // methode pour creer
    createReservation(reservation:any){
        return this.http.post(`${apiUrl}/reservations`,reservation);
    }


    getCategories() {
        return this.http.get(`${apiUrl}/categories`);
      }
    
      getPlacesByCategorie(categorieId: any) {
        return this.http.get(`${apiUrl}/categories/${categorieId}/places`);
      }

      // gestion tarif

      getTarifByCategorie(categorieId: any) {
        return this.http.get(`${apiUrl}/tarifs/${categorieId}`);
    }

    // les reservations d'un user

    getUserReservations() {
      return this.http.get(`${apiUrl}/user/reservations`);

  }
    
   
  

  
    }
      
      
      
      
      
      