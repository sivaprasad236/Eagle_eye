import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { GlobalServices } from './global-services';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private globalService: GlobalServices) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (localStorage.getItem('currentUser') || this.globalService.hasValidIdToken()) {
            // logged in so return true
            return true;
        } else {

            // not logged in so redirect to login page with the return url
            //this.router.navigate(['/reload']);
            let domain = localStorage.getItem('redirect_usermngt');
            window.location.href = domain;
            return false;
        }
    }
}