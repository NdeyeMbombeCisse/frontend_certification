import { inject } from "@angular/core";
import { Router } from "@angular/router";

export const AuthGuardAdmin = () =>{
    let router =inject(Router)
    let access_token;
    let user;

    if(localStorage.getItem("access_token")){
        access_token = JSON.parse(localStorage.getItem("access_token") || "");
        user = JSON.parse(localStorage.getItem("user") || "");

    }
    if (!user || (user.role !="admin" )){
        
        router.navigateByUrl("/portail");
        return false;

    }
    return true;

}