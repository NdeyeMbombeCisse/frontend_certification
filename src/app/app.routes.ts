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
import { AjoutBateauComponent } from './Composants/SuperAmin/ajout-bateau/ajout-bateau.component';
import { ModifierbateauComponent } from './Composants/SuperAmin/modifierbateau/modifierbateau.component';
import { AjoutinformationComponent } from './Composants/SuperAmin/ajoutinformation/ajoutinformation.component';
import { ModifierinformationComponent } from './Composants/SuperAmin/modifierinformation/modifierinformation.component';
import { InformationComponent } from './Composants/SuperAmin/information/information.component';
import { HistoriqueReservationComponent } from './Composants/SuperAmin/historique-reservation/historique-reservation.component';
import { AjoutReservationComponent } from './Composants/user/ajout-reservation/ajout-reservation.component';
import { ListeTrajetComponent } from './Composants/SuperAmin/liste-trajet/liste-trajet.component';
import { DetailTrajetComponent } from './Composants/Admin/detail-trajet/detail-trajet.component';
import { RolePermissionComponent } from './Composants/SuperAmin/role-permission/role-permission.component';
import { AjoutPermissionComponent } from './Composants/SuperAmin/ajout-permission/ajout-permission.component';
import { AttribuerRpermissionComponent } from './Composants/SuperAmin/attribuer-rpermission/attribuer-rpermission.component';

export const routes: Routes = [
    {path:"",pathMatch:'full',redirectTo:'portail'},
    // route pour l'utilisateur simple
    {path:"portail", component:PortailComponent},
    {path:"listre_trajet", component:TrajetEnCoursComponent},
    {path:"ajoutReservation", component:AjoutReservationComponent},
    {path:"historique_reservation", component:HistoriqueComponent},
    {path:"profil", component:ProfilComponent},
    {path:"inscription_user", component:InscriptionComponent},
    {path:"connexion", component:ConnexionComponent},
    {path:"modifier_profil", component:ModifierProfilComponent},

//Route pour SuperAdimin
{path:"dasbaord_Sadmin", component:DashboardComponent},
{path:"liste_bateau", component:BateauComponent},
{path:"ajouter_bateau", component:AjoutBateauComponent},
{path:"modifier_bateau", component:ModifierbateauComponent},
{path:"ajouter_information", component:AjoutinformationComponent},
{path:"modifier_information", component:ModifierinformationComponent},
{path:"historique_information", component:InformationComponent},
{path:"histaurique_reservation", component:HistoriqueReservationComponent},
{path:"liste_trajet", component:ListeTrajetComponent},
{path:"detail_reservation", component:DetailTrajetComponent},
{path:"ajout_Rpermission", component:AjoutPermissionComponent},
{path:"liste_Rpermission", component:RolePermissionComponent},
{path:"attribuer_role", component:AttribuerRpermissionComponent},

// route pour admin
















];
