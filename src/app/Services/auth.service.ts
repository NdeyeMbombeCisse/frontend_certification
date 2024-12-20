import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  


  private http =inject(HttpClient);

  register(identifienrts:any){
    return this.http.post(`${apiUrl}/store`,identifienrts)
  }
  // affichage profil

  profil(){
    return this.http.get(`${apiUrl}/profil`)


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
      const payload = token.split('.')[1]; 
      return JSON.parse(atob(payload)); 
    } catch (error) {
      console.error('Erreur lors du décodage du token', error);
      return null;
    }
  }

  isUserAuthenticated(): boolean {
    return this.isAuthenticated; // Retourner l'état d'authentification
}

// mofier profil
updateProfile(userData: any, id:any) {
  return this.http.put(`${apiUrl}/updateUser/${id}`,userData)
}


getUserCount() {
  return this.http.get(`${apiUrl}/user-count`)
}



getnoUserCount() {
  return this.http.get(`${apiUrl}/nouser-count`)
}


}