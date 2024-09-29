import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { apiUrl } from './apiUrl';
import { UserModel } from '../Composants/user/user.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  


  private http =inject(HttpClient);

  register(identifienrts:any){
    return this.http.post(`${apiUrl}/store`,identifienrts)
  }

  //Login
  login(identifienrts:any){
    return this.http.post(`${apiUrl}/login`,identifienrts)
  }


  
  
  // deconnexion
  logout(){
    return this.http.get(`${apiUrl}/logout`)
  }


  getUserId(): string | null {
    const userString = localStorage.getItem('user'); // Récupère les détails de l'utilisateur
  
    if (userString) {
      const user = JSON.parse(userString);
      return user.id || null; // Retourne l'ID de l'utilisateur
    }
  
    return null; // Retourne null si l'utilisateur n'est pas connecté
  }

  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1]; // JWT structure: header.payload.signature
      return JSON.parse(atob(payload)); // Décoder le payload
    } catch (error) {
      console.error('Erreur lors du décodage du token', error);
      return null;
    }
  }

  isUserAuthenticated(): boolean {
    return this.isAuthenticated; // Retourner l'état d'authentification
}



}