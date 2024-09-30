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

}