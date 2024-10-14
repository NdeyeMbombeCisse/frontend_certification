import { inject } from "@angular/core";
import { Router } from "@angular/router";

export const AuthGuardAdmin = () =>{
    let router =inject(Router)
    let access_token;
    let role;

    if(localStorage.getItem("access_token")){
        access_token = localStorage.getItem("access_token") || "";
        role = localStorage.getItem("role") || "";

    }
    if (!access_token || (role !="admin" )){ 
        router.navigateByUrl("/portail");
        return false;

    }
    return true;

}


