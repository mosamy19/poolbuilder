import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { AccountService } from "../apiServices/account/account.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private accountService: AccountService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Observable((observer) => {
      console.log(next);
      console.log(state);
      let user = this.accountService.getLocalStorageAccount();
      let hasAccount = this.accountService.getLocalStorageHasAccount();
      if (user && hasAccount) {
        observer.next(true);
      } 
      else if(user && !hasAccount){
        if(next.routeConfig.path === "sign-up"){
          observer.next(true);
        }
        else{
          this.router.navigate(["/sign-up"]);
          observer.next(false);
        }
      }
      else {
        console.log("User is not logged in");
        this.router.navigate(["/login"]);
        observer.next(false);
      }
    });
  }
}
