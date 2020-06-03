import { Component, OnInit, ViewChild } from '@angular/core';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { IonInfiniteScroll, ActionSheetController } from '@ionic/angular';
import { ProjectService } from 'src/app/apiServices/project/project.service';
import { ProjectsModelList } from 'src/app/apiModels/ProjectsModelList';
import { ProjectModel } from 'src/app/apiModels/ProjectModel';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ErrorToasterService } from 'src/app/ui-services/error-toaster.service';
import { AccountService } from 'src/app/apiServices/account/account.service';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.page.html',
  styleUrls: ['./projects-list.page.scss'],
})
export class ProjectsListPage implements OnInit {
  faTrashAlt = faTrashAlt;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  model : ProjectsModelList;
  pageSize : number ;
  projectsArr:ProjectModel [];
  isLoaded: boolean;
  hostUrl = environment.hostURL;
  constructor(private projectService:ProjectService,
    private accountService : AccountService,
    private actionSheetController: ActionSheetController, 
    private router: Router,
    private errToaster: ErrorToasterService) { }

  ngOnInit() {
  }
  ionViewWillEnter(){
    this.isLoaded = false;
    this.initVariables();
    this.getProjects(this.model.PageNumber,this.model.PageSize,null);
  }
  initVariables(){
    this.pageSize = 10;
    this.model = new ProjectsModelList(1,this.pageSize);
    this.projectsArr = [];
  }
  getProjects(pageNumber:number,pageSize:number,event){
    this.projectService.GetProjects(pageNumber,pageSize).subscribe(
      x=>{
       this.model = x;
       this.model.PageNumber ++;
       let userId = this.accountService.getLocalStorageUserId();
      this.model.Projects.forEach(x=>{
        debugger;
        if(x.CreatorId === userId){
          x.CanDelete = true;
        }
        else{
          x.CanDelete = false;
        }
      })
       this.projectsArr = this.projectsArr.concat(this.model.Projects);
       this.isLoaded = true;
       if(event && this.model.Projects.length < this.model.PageSize){
          event.target.disabled = true;
       }
      }
    );
  }
  loadProjects(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();
      this.getProjects(this.model.PageNumber,this.model.PageSize,event);
    }, 500);
  }

  async deleteProjectAS(event, id: number) {
    event.stopPropagation();
    const actionSheet = await this.actionSheetController.create({
      header: 'Are you want to delete this project?',
      mode: 'ios',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        handler: () => {
         this.projectService.DeleteProject(id).subscribe(data => {
           if(data) {
             this.projectsArr = this.projectsArr.filter(p => p.Id != data);
           }
         }, err => {
           if(err.status == 400) {
            console.log("Can't delete ths project");
            this.errToaster.presentToast("Unable to delete this project because it contains tasks.");
           } else {
             this.errToaster.presentToast();
           }
          console.log("err: ", err);
          });
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  goToProjectDetails(id) {
    this.router.navigate(['/project-details', id]);
  }
}
