import { Routes } from '@angular/router';
import { PortailComponent } from './Composants/user/portail/portail.component';
import { TrajetEnCoursComponent } from './Composants/user/trajet-en-cours/trajet-en-cours.component';
import { HistoriqueComponent } from './Composants/user/historique/historique.component';
import { ProfilComponent } from './Composants/user/profil/profil.component';
import { InscriptionComponent } from './Composants/user/inscription/inscription.component';
import { ConnexionComponent } from './Composants/user/connexion/connexion.component';
import { ModifierProfilComponent } from './Composants/user/modifier-profil/modifier-profil.component';
import { DashboardComponent } from './Composants/SuperAmin/dashboard/dashboard.component';
import { BateauComponent } from './Composants/SuperAmin/bateau/bateau.component';
import { ModifierbateauComponent } from './Composants/SuperAmin/modifierbateau/modifierbateau.component';
import { ModifierinformationComponent } from './Composants/SuperAmin/modifierinformation/modifierinformation.component';
import { InformationComponent } from './Composants/SuperAmin/information/information.component';
import { HistoriqueReservationComponent } from './Composants/SuperAmin/historique-reservation/historique-reservation.component';
import { AjoutReservationComponent } from './Composants/user/ajout-reservation/ajout-reservation.component';
import { ListeTrajetComponent } from './Composants/SuperAmin/liste-trajet/liste-trajet.component';
import { DetailTrajetComponent } from './Composants/Admin/detail-trajet/detail-trajet.component';
import { DashboadAdminComponent } from './Composants/Admin/dashboad-admin/dashboad-admin.component';
import { ModifierTrajetComponent } from './Composants/Admin/modifier-trajet/modifier-trajet.component';
import { AfficherTrajetComponent } from './Composants/Admin/afficher-trajet/afficher-trajet.component';
import { ReservationComponent } from './Composants/Admin/reservation/reservation.component';
import { InformationEncoursComponent } from './Composants/user/information-encours/information-encours.component';
import { AjoutTrajetComponent } from './Composants/Admin/ajout-trajet/ajout-trajet.component';
import { ScanComponent } from './Composants/scan/scan.component';
import { AuthGuardAdmin } from './Composants/admin.guard';
import { AuthGuardsuperAdmin } from './Composants/supadmin.guard';
import { AuthGuardsuperVigile } from './Composants/vigile.guard';
import { PlaceAdminComponent } from './Composants/Admin/place-admin/place-admin.component';
import { DiagrammeComponent } from './diagramme/diagramme.component';

export const routes: Routes = [
    {path:"",pathMatch:'full',redirectTo:'portail'},
    // route pour l'utilisateur simple
    {path:"portail", component:PortailComponent},
    {path:"liste_trajet", component:TrajetEnCoursComponent},
    {path:"ajoutReservation", component:AjoutReservationComponent},
    { path: 'reservation/:id', component: AjoutReservationComponent},
    {path:"historique_reservation", component:HistoriqueComponent},
    {path:"profil", component:ProfilComponent},
    {path:"inscription_user", component:InscriptionComponent},
    {path:"connexion", component:ConnexionComponent},
    {path:"modifier_profil", component:ModifierProfilComponent},
    {path:"nouvelle_info", component:InformationEncoursComponent},

//Route pour SuperAdimin
    {path:"dasbaord_Sadmin", component:DashboardComponent,canActivate:[AuthGuardsuperAdmin]},
    {path:"liste_bateau", component:BateauComponent,canActivate:[AuthGuardsuperAdmin]},
    {path:"modifier_bateau", component:ModifierbateauComponent,canActivate:[AuthGuardsuperAdmin]},
    {path:"modifier_information", component:ModifierinformationComponent,canActivate:[AuthGuardsuperAdmin]},
    {path:"historique_information", component:InformationComponent,canActivate:[AuthGuardsuperAdmin]},
   


// route pour admin
    {path:"dasbaord_admin", component:DashboadAdminComponent,canActivate:[AuthGuardAdmin]},
    {path:"ajouterTrajet", component:AjoutTrajetComponent,canActivate:[AuthGuardAdmin]},
    {path:"ModifierTrajet/:id", component:ModifierTrajetComponent,canActivate:[AuthGuardAdmin]},
    {path:"afficher_trajet", component:AfficherTrajetComponent,canActivate:[AuthGuardAdmin]},
    {path:"afficher_trajet", component:AfficherTrajetComponent,canActivate:[AuthGuardAdmin]},
    { path: 'trajet/:trajetId/reservations',component:DetailTrajetComponent ,canActivate:[AuthGuardAdmin]},
    {path:"liste_reservation", component:ReservationComponent,canActivate:[AuthGuardAdmin]},
    {path:'trajet/:id', component:PlaceAdminComponent,canActivate:[AuthGuardAdmin]},
    {path:"diagramme", component:DiagrammeComponent,canActivate:[AuthGuardAdmin]},

    
// vigile
    {path:"sca", component:ScanComponent,canActivate:[AuthGuardsuperVigile]},
    



    
















];
