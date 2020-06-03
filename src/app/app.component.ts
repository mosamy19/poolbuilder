import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { AccountService } from "./apiServices/account/account.service";
import { AccountModel } from "./apiModels/AccountModel";
import { error } from "protractor";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  navigate: any;
  faSignOutAlt = faSignOutAlt;
  accountModel: AccountModel;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private accountService: AccountService,
    private router: Router
  ) {
    this.initializeApp();
    this.sideMenu();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  sideMenu() {
    this.navigate = [
      {
        title: "Home",
        url: "/home",
      },
    ];
  }

  logout() {
    this.accountModel = this.accountService.getLocalStorageAccount();
    if (this.accountModel && this.accountModel.Id) {
      this.accountService.logout(this.accountModel.Id).subscribe(
        (data) => {
          localStorage.clear();
          this.router.navigate(["login"]);
        },
        (error) => {
          localStorage.clear();
          this.router.navigate(["login"]);
        }
      );
    }
  }

  get UserName() {
    let _accountModel = this.accountService.getLocalStorageAccount();
    if (_accountModel) {
      let { Name } = _accountModel;
      return Name;
    } else {
      return "User";
    }
  }

  get imageUrl() {
    let _accountModel = this.accountService.getLocalStorageAccount();
    if (_accountModel) {
      let { ImageName, ImageFolderPath } = _accountModel;
      if (ImageName && ImageFolderPath) {
        return environment.hostURL + ImageFolderPath + ImageName;
      }
    } else {
      return "assets/images/default-user-img.svg";
    }
  }
  get isLoggedIn(): boolean {
    if (this.accountService.getLocalStorageAccount()) {
      return true;
    } else {
      return false;
    }
  }
}
