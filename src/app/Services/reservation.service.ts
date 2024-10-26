import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { apiUrl } from "./apiUrl";
import { map, Observable, tap } from "rxjs";

@Injectable(
    {providedIn:'root'}
)

export class ReservationService{
  // private apiUrl = 'https://api.naboopay.com/api/v1/transaction/create-transaction';
    // injection de dependance
    private http = inject(HttpClient);

    // methode pour creer
    createReservation(reservation:any){
        return this.http.post(`${apiUrl}/reservations`,reservation);
    }


    getCategories() {
        return this.http.get(`${apiUrl}/categories`);
      }
    
      getPlacesByCategorie(categorieId: any, trajetId:any) {
        return this.http.get(`${apiUrl}/trajets/${trajetId}/categories/${categorieId}/places`);

      }

    

      // gestion tarif

      getTarifByCategorie(categorieId: any) {
        return this.http.get(`${apiUrl}/tarifs/${categorieId}`);
    }

    // les reservations d'un user

    getUserReservations() {
      return this.http.get(`${apiUrl}/user/reservations`);

  }

  getAllReservation(){
    return this.http.get(`${apiUrl}/reservations`);
}

// les reservations d'un trajet
getReservationsByTrajet(trajetId: number) {
  return this.http.get(`${apiUrl}/trajets/${trajetId}/reservations`);
}
    
  //  nombre de rservation
  getCount() {
    return this.http.get(`${apiUrl}/countReservation`);
}

// valider code qr
validateQRCode(data: { code: string }) {
  return this.http.post(`${apiUrl}validate-qr`, data);
}

// places reservee
getReservedPlaces(trajetId: number) {
  return this.http.get(`${apiUrl}/trajets/${trajetId}/places-reservees`);
}






getAvailablePlacesForTrajet(trajetId: number){
  return this.http.get(`${apiUrl}/trajets/${trajetId}/places`);
}


// notification
getNotifications() {
  return this.http.get(`${apiUrl}/notifications`);
}


// changer le sattut de la place

updatePlaceReservation(placeId: number, isReserved: boolean){
  return this.http.put(`${apiUrl}/placeReservee/${placeId}`, { is_reserved: isReserved });
}


getPlacesByTrajet(trajet:any){
  return this.http.get(`${apiUrl}/places/trajet/${trajet}`);


}


// '/trajets/{trajetId}/places'

getReservedPlacesForTrajet(trajetId: number) {
  return this.http.get(`${apiUrl}/reservations/trajet/${trajetId}`);
}


// resrvation dans la semaine

getReservationsByWeek(){
  return this.http.get(`${apiUrl}/reservation/weekly`);
}

// voyage enregstrer
getVoyagesEffectuesByWeek(){
  return this.http.get(`${apiUrl}/voyages/effectues/semaine`);
}

createTransaction(reservationId: number) {
  return this.http.post(`${apiUrl}/create-transaction/${reservationId}`, {});
}


    }
      
      
      
      
      
      