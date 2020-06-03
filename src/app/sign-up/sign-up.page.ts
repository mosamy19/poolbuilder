import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { faCamera, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { AccountModel } from "src/app/apiModels/AccountModel";
import { AccountService } from "src/app/apiServices/account/account.service";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import Compressor from "compressorjs";
import { ErrorToasterService } from "../ui-services/error-toaster.service";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.page.html",
  styleUrls: ["./sign-up.page.scss"],
})
export class SignUpPage implements OnInit {
  form: FormGroup;
  name;
  accountModel: AccountModel;
  faCamera = faCamera;
  faCircleNotch = faCircleNotch;
  accountSubmitted: boolean;
  profileImg: File;
  ImageUrl: string;

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private router: Router,
    private errToaster: ErrorToasterService,
    private cd: ChangeDetectorRef
  ) {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      Id: new FormControl("", [Validators.required]),
      Name: new FormControl("", [Validators.required]),
      PhoneNumber: new FormControl("", [Validators.required]),
    });
  }

  async ionViewWillEnter() {
    let {
      Id,
      PhoneNumber,
    } = await this.accountService.getLocalStorageAccount();
    this.ImageUrl = "assets/images/default-user-img.svg";
    this.profileImg = null;
    this.form.reset();
    this.form.controls.Id.setValue(Id);
    this.form.controls.PhoneNumber.setValue(PhoneNumber);
  }
  ngOnInit() {
    this.accountModel = new AccountModel();
  }

  clickHandler() {
    document.getElementById("file-upload").click();
  }

  imageChange(event, comp) {
    const file = event.target.files[0];
    let base64data;
    if (!file) {
      return;
    }
    new Compressor(file, {
      maxWidth: 600,
      success(result) {
        var nameArr = file.name.split(".");
        comp.photoType = nameArr[nameArr.length - 1];
        const reader = new FileReader();
        reader.readAsDataURL(result);
        reader.onloadend = function (e: any) {
          base64data = reader.result;
          comp.photoBase64 = reader.result.toString().split(",")[1];
          comp.ImageUrl = e.target.result;
          comp.profileImg = result as File;
          comp.cd.detectChanges();
        };
      },
    });
  }

  createAccount() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      let _img = this.profileImg ? this.profileImg : null;
      console.log(_img);
      this.accountModel = this.form.value as AccountModel;
      this.accountSubmitted = true;
      this.accountService.createAccount(this.accountModel, _img).subscribe(
        (data) => {
          console.log(data);
          this.accountSubmitted = false;
          let account = data as AccountModel;
          this.accountService.setLocalStorageAccount(account);
          this.accountService.setLocalStorageHasAccount(true);
          this.router.navigate(["projects"]);
          console.log(data);
        },
        (err) => {
          this.accountSubmitted = false;
          this.errToaster.presentToast();
          return console.log(err);
        }
      );
    }
  }
}
