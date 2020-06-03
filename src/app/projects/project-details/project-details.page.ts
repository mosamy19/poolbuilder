import { Component, OnInit, ViewChild } from '@angular/core';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { ProjectService } from 'src/app/apiServices/project/project.service';
import { AccountService } from 'src/app/apiServices/account/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectModel } from 'src/app/apiModels/ProjectModel';
import { TaskModel } from 'src/app/apiModels/TaskModel';
import { IonInfiniteScroll, ActionSheetController } from '@ionic/angular';
import { TaskService } from 'src/app/apiServices/task/task.service';
import { TaskModelList } from 'src/app/apiModels/TasksModelList';
import { ErrorToasterService } from 'src/app/ui-services/error-toaster.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.page.html',
  styleUrls: ['./project-details.page.scss'],
})
export class ProjectDetailsPage implements OnInit {
  faTrashAlt= faTrashAlt;
  project:ProjectModel;
  tasks:TaskModelList;
  taskPageSize:number;
  tasksArr:TaskModel[];
  isLoaded: boolean;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  constructor(private projectService:ProjectService
    ,private taskService : TaskService
    ,private router:Router
    ,private actRoute: ActivatedRoute,
    public actionSheetController: ActionSheetController,
    private errToaster: ErrorToasterService,
    private accountService: AccountService) { 
     this.initVariables();
    }

  ngOnInit() {  
  }
  ionViewWillEnter(){
    this.isLoaded = false;
    this.initVariables();
    let id = this.actRoute.snapshot?.params?.id;
    if(id){
      this.getProject(id);
    }
  }
  initVariables(){
    this.project = new ProjectModel();
    this.tasks= new TaskModelList(1,this.taskPageSize);
    this.taskPageSize = 10;
    this.tasksArr = [];
  }
  getProject(id:number){
    this.projectService.GetProject(id,this.taskPageSize).subscribe(
      x=>{
        if(x){
          debugger;
          console.log(x);
          this.project = x.Project;
          this.tasks = x.Tasks? x.Tasks :new TaskModelList(0,this.taskPageSize);
          this.tasks.PageNumber ++;
          let userId = this.accountService.getLocalStorageUserId();
          this.tasks.Tasks.forEach(x=>{
           debugger;
           if(x.CreatorId === userId){
             x.CanDelete = true;
           }
           else{
             x.CanDelete = false;
           }
         })
          this.tasksArr = this.tasksArr.concat(this.tasks.Tasks);
          this.isLoaded = true;
        }
        else{
          // project not found
          
        }
        
      }, err => {
        this.isLoaded = true;
        this.errToaster.presentToast();
      }
    )
  }
  getTasks(projectId:number,pageNumber:number,pageSize:number,event){
    this.taskService.GetTasks(projectId,pageNumber,pageSize).subscribe(
      x=>{
       this.tasks = x;
       this.tasks.PageNumber ++;
       let userId = this.accountService.getLocalStorageUserId();
       this.tasks.Tasks.forEach(x=>{
        debugger;
        if(x.CreatorId === userId){
          x.CanDelete = true;
        }
        else{
          x.CanDelete = false;
        }
      })
       this.tasksArr = this.tasksArr.concat(this.tasks.Tasks);
       if(event && this.tasks.Tasks.length < this.tasks.PageSize){
          event.target.disabled = true;
       }
      }
    );
  }
  loadTasks(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();
      this.getTasks(this.project.Id,this.tasks.PageNumber,this.tasks.PageSize,event);
    }, 500);
  }

  async deleteTaskAS(event, id) {
    event.stopPropagation();
    const actionSheet = await this.actionSheetController.create({
      header: 'Are you want to delete this task?',
      mode: 'ios',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        handler: () => {
          this.taskService.DeleteTask(id).subscribe(data => {
            console.log(data);
            if(data) {
              this.tasksArr = this.tasksArr.filter(task => task.Id != data);
            }
          }, err => this.errToaster.presentToast());
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

  goToTaskDetails(id){
    this.router.navigate(['/task-details', id]);
  }
}
