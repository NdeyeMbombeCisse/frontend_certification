import { CategorieModel } from "./categorie.model";

export interface PlaceModel{
    id?:number;
    libelle?:string;
    categorie_id?:number;
    is_reserved?:number; 
    id_bateau?:number;
    categorie?:CategorieModel
   
  }


  