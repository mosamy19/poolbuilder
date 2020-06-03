import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/apiServices/task/task.service';
import { TaskModel } from 'src/app/apiModels/TaskModel';
import { AccountService } from 'src/app/apiServices/account/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountModel } from 'src/app/apiModels/AccountModel';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ErrorToasterService } from 'src/app/ui-services/error-toaster.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
})
export class AddTaskPage implements OnInit {
  model:TaskModel;
  account : AccountModel;
  taskForm:FormGroup;
  projectId:number;
  waitingResonse:boolean;
  constructor(private taskService:TaskService
    ,private accountService:AccountService
    ,private formBuilder : FormBuilder
    ,private router : Router,
    private actRoute: ActivatedRoute, private errToaster: ErrorToasterService) {
      this.model = new TaskModel();
     }

  ngOnInit() {
    this.buildForm();
  }
  ionViewWillEnter(){
    this.model = new TaskModel();
    this.account = this.accountService.getLocalStorageAccount();  
    let projectId =  this.actRoute.snapshot.paramMap.get('projectId');
    this.projectId = projectId ?parseInt(projectId) :0;
    this.buildForm();
  }
  buildForm(){
     this.taskForm = this.formBuilder.group({
        Title : [this.model.Title, [Validators.required,Validators.maxLength(256)]],
        Description : [this.model.Description, [Validators.required,Validators.maxLength(4000)]],
     });
  }
  addTask(model:TaskModel){
    this.taskService.AddTask(model).subscribe(
      x=>{
        debugger;
        if(x && x.Id){
           this.router.navigate(['project-details/', x.ProjectId])
           this.waitingResonse = false;
        }
      },
      error=>{
        //error
        this.errToaster.presentToast();
        this.waitingResonse = false;
        console.log(error);
      }
    )
  }
  submit(){
    debugger;
    this.taskForm.markAllAsTouched();
    if(this.projectId >0 && this.taskForm.valid && this.account && this.account.Id){
      this.waitingResonse = true;
       this.model = this.taskForm.value as TaskModel;
       this.model.CreatorId = this.account.Id;
       this.model.ProjectId = this.projectId; 
       this.addTask(this.model);
    }
    else{
      // error
      // this.errToaster.presentToast();
    }
  }
  get form() { return this.taskForm.controls; }
}
