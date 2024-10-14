import { inject } from "@angular/core";
import { Router } from "@angular/router";

export const AuthGuardsuperAdmin = () =>{
    let router =inject(Router)
    let access_token;
    let role;

    if(localStorage.getItem("access_token")){
        access_token = localStorage.getItem("access_token") || "";
        role = localStorage.getItem("role") || "";

    }
    if (!access_token || (role !="superAdmin" )){ 
        router.navigateByUrl("/portail");
        return false;

    }
    return true;

}

