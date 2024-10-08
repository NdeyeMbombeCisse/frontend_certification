
import { HttpEvent, HttpHandlerFn, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";



export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    let access_token = localStorage.getItem("access_token");

    if (!access_token) {
        return next(req);
    }

    // Créer les en-têtes avec le token
    const headers = new HttpHeaders({
        Authorization: `Bearer ${access_token}`
    });

    // Cloner la requête avec les nouveaux en-têtes
    const newRequete = req.clone({
        headers
    });

    return next(newRequete);
}
