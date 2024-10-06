export interface NotifModel{
    id?:number |undefined;
    date_depart?:Date;
    date_arrivee?:Date;
    lieu_depart?:string;
    lieu_arrive?:string;
    image?:string | File; 
    statut?:boolean |undefined |number ;
    heure_embarquement?:string;
    heure_depart?:string;
    bateau_id?:number;
    timestamp?:Date;
   
   }
