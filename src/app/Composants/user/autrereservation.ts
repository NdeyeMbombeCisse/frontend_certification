

export interface NoconectModel{
    id?:number;
    prenom?:string;
    nom?:string;
    numero_registre?:string;
    age?: number | null;
    nationnalite?:string;
    telephone?:string;
    numero_identite?:string;
   
  }

  export interface ErrorModel {
    message: string;
    // Tu peux ajouter d'autres propriétés si nécessaire
  }
  
