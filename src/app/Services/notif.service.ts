import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { apiUrl } from "./apiUrl";
import { map } from "rxjs";

@Injectable(
    {providedIn:'root'}
)

export class NotifService{
    // injection de dependance
    private http = inject(HttpClient);

    // methode pour creer
  


    getRecentNotifications() {
        return this.http.get(`${apiUrl}/categories`);
      }
    
   
  
    }
      
      
      
      
      
      