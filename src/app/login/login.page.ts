import { Component, OnInit, ViewChildren, ChangeDetectorRef } from "@angular/core";
import * as firebase from "firebase";
import { AngularFireAuth } from "angularfire2/auth";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IonInput } from "@ionic/angular";
import { compileComponentFromMetadata } from "@angular/compiler";
import { LoginModel } from "../apiModels/LoginModel";
import { Platform } from "@ionic/angular";
import { AccountService } from "../apiServices/account/account.service";
import { AccountModel } from "../apiModels/AccountModel";
import { Router } from "@angular/router";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { environment } from './../../environments/environment';
import { ToastController } from '@ionic/angular';

declare var FirebasePlugin: any;
@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  code = null;
  countryCode = "+1";
  phone: string = "";
  windowRef: any;
  model: LoginModel;
  form: FormGroup;
  resendTimer: string;
  disabeleResendBtn: boolean = true;
  formInput = ["input1", "input2", "input3", "input4", "input5", "input6"];
  @ViewChildren("formRow") rows: any;
  isCodeSend: boolean;
  isCordova: boolean;
  fakeCode: string = "123456";
  verificationCode:string;
  defaultImage = 'assets/images/default-user-img.svg'
  accountImage = this.defaultImage ;
  accountName = "";
  faCircleNotch = faCircleNotch;
  waitingResonse: boolean;
  invalidPhoneNumer: boolean;
  verifyCodeIncorrect: boolean;
  userDataLoaded: boolean;
  errMsg ="";
  credential : any;
  constructor(
    public fAuth: AngularFireAuth,
    private accountService: AccountService,
    private platform: Platform,
    private router: Router,
    private cd: ChangeDetectorRef,
    public toastController: ToastController
  ) {}
  ngOnInit() {
    this.isCordova = this.platform.is("cordova");
    this.windowRef = window;
    if (!this.isCordova) {
      this.addRecaptchaVerifier();
    }
  }
  ionViewWillEnter(){
    this.form = this.toFormGroup(this.formInput);
    this.model = new LoginModel();
    this.isCodeSend = false;
    this.phone="";
    this.code="";
    this.accountImage = this.defaultImage;
    this.accountName ="";
  }
  //---------web-------//
  addRecaptchaVerifier() {
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container"
    );
    this.windowRef.recaptchaVerifier.render();
  }
  sendWithAppVerifier() {
    debugger;
    let comp = this;

    var number = this.countryCode + this.phone;
    const appVerifier = this.windowRef.recaptchaVerifier;
    console.log(appVerifier);
    this.fAuth.auth
      .signInWithPhoneNumber(number, appVerifier)
      .then((result) => {
        debugger;
        comp.windowRef.confirmationResult = result;
        comp.waitingResonse = false;
        comp.isCodeSend = true;
        comp.getAccountByPhoneNumber(number);
        // this.resendCodeTimer(60);
      })
      .catch((error) => {
        comp.waitingResonse = false;
        if (
          error.message == "TOO_SHORT" ||
          error.message == "TOO_LONG" ||
          error.message == "Invalid format."
        ) {
          comp.invalidPhoneNumer = true;
        }
        comp.waitingResonse = false;
        comp.errorToast();
        return console.log(error);
      });
  }
  verifyWithAppVerifier() {
    // this.submitVerifyCode
    this.windowRef.confirmationResult
      .confirm(this.code)
      .then((result) => {
        console.log(result.user);
        debugger;
        this.waitingResonse = false;
        this.model = this.initLoginModel(result.user);
        this.login(this.model);
      })
      .catch((error) => {
        this.waitingResonse = false;
        this.verifyCodeIncorrect = true;
        return console.log(error, "Incorrect code entered?");
      });
  }

  //--------plugin------//
  verify() {
    var comp = this;
    var number = comp.countryCode + comp.phone;
    var timeOutDuration = 60;
    comp.verificationCode = comp.code ? comp.code : comp.fakeCode;
    var awaitingSms = false;
    FirebasePlugin.verifyPhoneNumber(
      function (credential: any) {
        comp.credential = credential;
        console.log(credential);
        if (credential.instantVerification) {
          if (awaitingSms) {
            awaitingSms = false;
          }
          comp.signInWithCredential(credential);
        }
         else {
           console.log("awaitingSms" + awaitingSms)
          if(awaitingSms){
            awaitingSms = false;
          }
          credential.code = comp.code; // set the user-entered verification code on the credential object
          comp.signInWithCredential(credential);
        }
      },
      function (error) {
        comp
        .waitingResonse = false;
        comp.errorToast();
        console.error(
          "Failed to verify phone number: " + JSON.stringify(error)
        );
      },
      number,
      timeOutDuration,
      comp.verificationCode
    );
  }
  verifyCode(comp){
    console.log("from verfiy code");
    comp.credential.code = comp.code; // set the user-entered verification code on the credential object
    console.log(comp.credential);
    comp.signInWithCredential(comp.credential);
  }
  signInWithCredential(credential) {
    let comp = this;
    FirebasePlugin.signInWithCredential(
      credential,
      function () {
        console.log("Successfully signed in");
        comp.verfiyCurrentUser();
      },
      function (error) {
        console.log(credential.code);
        console.log(comp.code);
        console.log(comp.verificationCode);
        if (comp.verificationCode == comp.fakeCode) {
          console.log(comp.countryCode + comp.phone);    
          comp.isCodeSend = true;
          comp.waitingResonse = false;
          comp.getAccountByPhoneNumber(comp.countryCode + comp.phone);
          console.log(error);
          console.log( comp.isCodeSend);
          comp.cd.detectChanges();
        }
        console.error("Failed to sign in", error);
      }
    );
  }
  //--------user--------//
  verfiyCurrentUser() {
    let comp = this;
    FirebasePlugin.getCurrentUser((user: any) => {
      console.log(user);
      if (user && user.uid) {
        // backend call
        comp.waitingResonse = false;
        console.log(user);
        comp.model = comp.initLoginModel(user);
        console.log(comp.model);
        comp.login(comp.model);
      } else {
        // comp.errorToast();
        comp.waitingResonse = false;
        console.log("invalid user");
      }
    });
  }
  login(model: LoginModel) {
    this.accountService.login(model).subscribe(
      (data) => {
        debugger;
        if (data) {
          let navigateTo = data.HasAccount ? "projects" : "sign-up";
          if(data.Account){
            let account = data.Account as AccountModel;
            this.accountService.setLocalStorageAccount(account);
            this.accountService.setLocalStorageToken(data.Token);
            this.accountService.setLocalStorageHasAccount(data.HasAccount);
          }
          this.router.navigate([navigateTo]);
          //localStorage.setItem("account", JSON.stringify(data));
          console.log(data);
        }
      },
      (error) => {
        this.errorToast();
        console.log(error);
      }
    );
  }
  getAccountByPhoneNumber(phoneNumber: string) {
    this.accountService
      .getAccountByPhoneNumber(phoneNumber)
      .subscribe((data) => {
        debugger;
        var accountModel = data as AccountModel;
        if(accountModel){
          if(accountModel.ImageFolderPath && accountModel.ImageName) {
            this.accountImage = environment.hostURL + accountModel.ImageFolderPath + accountModel.ImageName;
          }
          this.accountName = accountModel.Name;
        } 
        this.userDataLoaded = true;
        this.cd.detectChanges();       
      });
  }
  initLoginModel(firebaseUser: any) {
    debugger;
    let model = new LoginModel();
    model = new LoginModel();
    model.FirebaseUserId = firebaseUser.uid;
    model.PhoneNumber = firebaseUser.phoneNumber;
    model.ProviderId = "phone";
    return model;
  }
  //-------------------//
  toFormGroup(elements) {
    const group: any = {};

    elements.forEach((key) => {
      group[key] = new FormControl("", [
        Validators.required,
        Validators.min(0),
        Validators.max(9),
      ]);
    });
    return new FormGroup(group);
  }

  keyUpEvent(event, index) {
    let pos = index;
    if (event.keyCode === 8 && event.which === 8) {
      pos = index - 1;
    } else {
      pos = index + 1;
      //  if (
    //   (event.keyCode >= 48 && event.keyCode <= 57) ||
    //   (event.keyCode >= 96 && event.keyCode <= 105)
    // )
    }
    if (pos > -1 && pos < this.formInput.length) {
      (this.rows._results[pos] as IonInput).setFocus();
    }
  }

  submitVerifyCode() {
    if(this.form.valid) {
      this.waitingResonse = true;
      let { value } = this.form;
      let code = "";
      Object.keys(this.form.value).forEach(function (item) {
        code += value[item];
      });
      this.code = code;
      if (this.isCordova) {
        //this.verify();
        if(this.platform.is("ios")){
          this.verifyCode(this);
        }
        else{
          this.verify();
        }
        
      } else {
        this.verifyWithAppVerifier();
      }
    }
  }

  submitPhoneNumber() {
    this.errMsg = "";
    if (this.countryCode !== "" && this.phone !== "") {
      this.invalidPhoneNumer = false;
      this.waitingResonse = true;
      if (this.isCordova) {
        this.verify();
      } else {
        this.sendWithAppVerifier();
      }
    } else {
      this.errMsg ="Please enter your phone number";
    }
  }

  async errorToast() {
    const toast = await this.toastController.create({
      message: 'An error occurred, please try again.',
      duration: 2000
    });
    toast.present();
  }

  resendCodeTimer(duration) {
    (this.rows._results[0] as IonInput).setFocus();
    var timer = duration,
      minutes,
      seconds;
    setInterval(() => {
      minutes = parseInt(`${timer / 60}`, 10);
      seconds = parseInt(`${timer % 60}`, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      this.resendTimer = minutes + ":" + seconds;
      if (timer <= 0) {
        this.disabeleResendBtn = false;
      } else {
        --timer;
      }
    }, 1000);
  }
}
