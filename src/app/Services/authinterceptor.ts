import { HttpEvent, HttpHandlerFn, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export function authInterceptor(req:HttpRequest<unknown>,next:HttpHandlerFn):Observable<HttpEvent<unknown>>{
    let access_token;
   

    if(localStorage.getItem("access_token")){
        access_token = JSON.parse(localStorage.getItem("access_token") || "");

    }
    if(!access_token){
        return next(req);
    } 

    const headers = new HttpHeaders(

       { Authorization:`Bearer ${access_token}`}
    );


    const newRequete = req.clone({
        headers
    });

    return next (newRequete);

}