import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {UserService} from "../service/user.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return this.isAuthenticatedUser();
  }

  constructor(private userService: UserService, private router: Router) {

  }

  private isAuthenticatedUser(): boolean {
    if (this.userService.isAuthenticated()){
      return true;
    }else{
      this.router.navigate(['/login'])
      return false;
    }
  }

}
