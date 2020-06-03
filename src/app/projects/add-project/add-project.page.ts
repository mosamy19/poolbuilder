import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/apiServices/project/project.service';
import { ProjectModel } from 'src/app/apiModels/ProjectModel';
import { AccountModel } from 'src/app/apiModels/AccountModel';
import { AccountService } from 'src/app/apiServices/account/account.service';
import { Router } from '@angular/router';
import { ErrorToasterService } from 'src/app/ui-services/error-toaster.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.page.html',
  styleUrls: ['./add-project.page.scss'],
})
export class AddProjectPage implements OnInit {
  model:ProjectModel;
  account :AccountModel;
  errMsg: string;
  projectNameMaxLen = 256;
  waitingResonse:boolean;
  constructor(private projectService:ProjectService
    ,private accountService:AccountService
    ,private router:Router, private errToaster: ErrorToasterService) { }

  ngOnInit() {
    this.model = new ProjectModel();
    this.account = this.accountService.getLocalStorageAccount();
  }
  
  ionViewWillEnter() {
    this.model.Name = "";
  }

  submit(){
    debugger;
    this.errMsg = "";
    if(this.model.Name && this.model.Name.length <= this.projectNameMaxLen && this.account) {
      this.waitingResonse = true;
      this.model.CreatorId = this.account.Id;
      this.createProject(this.model);
    } 
    else{
      if(!this.model.Name){
        this.errMsg = "Project name is required.";
      }
      if(this.model.Name.length > this.projectNameMaxLen)  {
        this.errMsg = `Project name  shouldn't exceed ${this.projectNameMaxLen} characters.`;
      }
    }
  }
  createProject(model:ProjectModel){
    this.projectService.CreateProject(model).subscribe(
      x=>{
        debugger;
        if(x && x.Id > 0){
          this.waitingResonse = false;
          this.router.navigate(["projects"]);
        }
      },
      error=>{
        console.log(error);
        this.waitingResonse = false;
        this.errToaster.presentToast();
      }
    )
  }

}