import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { apiUrl } from "./apiUrl";

@Injectable(
    {providedIn:'root'}
)

export class TrajetService{
    // injection de dependance
    private http = inject(HttpClient);

    // methode pour creer
    createTrajet(trajet:any){
        return this.http.post(`${apiUrl}/trajets`,trajet);
    }

    // 1-methode recuperer la liste des livres
    getAllTrajet(){
        return this.http.get(`${apiUrl}/trajets`);
    }

    // methode pour modifer un livre
    updateTrajet(id:any,trajet:any){
        return this.http.post(`${apiUrl}/${id}`,trajet);
    }

    // methode pour la supprsion d'un livre
    deleteTrajet(id:any){
        return this.http.delete(`${apiUrl}/${id}`);
    }

}