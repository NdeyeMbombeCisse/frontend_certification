import { TrajetModel } from "../Admin/trajet.model";
import { PlaceModel } from "./place.model";

export interface ReservationModel{
    id?:number;
    statut?:boolean;
    trajet_id?:number |null;
    user_id?:number |null; 
    place_id?:number |null;
    is_paid?:boolean;
    timestamp?:Date;
    place?:PlaceModel;
    trajet?:TrajetModel
  }

  export interface ErrorModel {
    message: string;
    // Tu peux ajouter d'autres propriétés si nécessaire
  }
  