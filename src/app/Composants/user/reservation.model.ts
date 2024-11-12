import { TrajetModel } from "../Admin/trajet.model";
import { CategorieModel } from "./categorie.model";
import { TarifModel } from "./historique/tarif.model";
import { PlaceModel } from "./place.model";
import { UserModel } from "./user.model";

export interface ReservationModel{
    id?:number;
    statut?:boolean;
    trajet_id?:number |null;
    user_id?:number |null; 
    place_id?:number |null;
    is_paid?:boolean;
    created_at?:Date;
    place?:PlaceModel;
    trajet?:TrajetModel;
    qr_code?:string;
    tarif?:TarifModel;
    categorie?:CategorieModel;
    user?:UserModel;
    no_connect_id?:number;
   
  }

  export interface ErrorModel {
    message: string;
    // Tu peux ajouter d'autres propriétés si nécessaire
  }
  
