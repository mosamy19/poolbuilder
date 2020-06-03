import { Component, OnInit, ViewChild } from "@angular/core";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { TaskService } from 'src/app/apiServices/task/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskModel } from 'src/app/apiModels/TaskModel';
import { environment } from 'src/environments/environment';
import { ActionSheetController, IonInfiniteScroll, IonContent } from '@ionic/angular';
import { ErrorToasterService } from 'src/app/ui-services/error-toaster.service';
import { AccountService } from 'src/app/apiServices/account/account.service';
import { CommentSignalRService } from 'src/app/apiServices/task/comment-signal-r.service';
import { HttpClient } from '@angular/common/http';
import { TaskCommentModel } from 'src/app/apiModels/TaskCommentModel';
import { TaskCommentsModelList } from 'src/app/apiModels/TaskCommentsModelList';
@Component({
  selector: "app-task-details",
  templateUrl: "./task-details.page.html",
  styleUrls: ["./task-details.page.scss"],
})
export class TaskDetailsPage implements OnInit {
  faTrashAlt = faTrashAlt;
  faPaperPlane = faPaperPlane;
  id:number;
  userId:string;
  model:TaskModel;
  hostUrl = environment.hostURL;
  isLoaded:boolean;
  defultImage : string ='assets/images/default-user-img.svg';
  creatorImage:string = this.defultImage;
  commentModel:TaskCommentModel;
  commentsModelList : TaskCommentsModelList;
  commentsPageSize:number;
  comments:TaskCommentModel[];
  getCommentsLoading:boolean;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  addingComment:boolean;
  currentThreadCount:number;
  @ViewChild("ionContentTemplate") ionContentTemplate: IonContent;
  constructor(private taskService : TaskService,
    private actRoute:ActivatedRoute,
    private actionSheetController: ActionSheetController,
    private errToaster: ErrorToasterService,
    private router: Router,
    private accountService: AccountService,
    public signalRService: CommentSignalRService, private http: HttpClient) {}
  ngOnInit() {
     this.initVariables();
  }
  ionViewWillEnter(){
    this.isLoaded = false;
    this.initVariables();
    this.getTask();
    this.signalRService.startConnection();
    this.signalRService.addtransferCommentDataListener();   
    this.commentActionSubscribeEvent();
  }
  ionViewDidLeave(){
    debugger;
    this.signalRService.stopConnection();
  }
  initVariables(){
    this.currentThreadCount = 0;
    this.id = this.actRoute.snapshot?.params?.id;
    this.userId =this.accountService.getLocalStorageUserId();
    this.model =  new TaskModel();
    this.commentModel = new TaskCommentModel();
    this.commentModel.TaskId = this.id;
    this.commentModel.UserId = this.userId;
    this.commentsPageSize = 10;
    this.commentsModelList = new TaskCommentsModelList(1,this.commentsPageSize);
    this.comments = [];
    this.getCommentsLoading = false;
  }
  getTask(){
    this.taskService.GetTask(this.id,this.commentsPageSize,this.currentThreadCount).subscribe(
      x=>{
        if(x){
          if(x.Task){
            this.model = x.Task;
            let userId = this.accountService.getLocalStorageUserId();
            if(this.model.CreatorId === userId){
              this.model.CanDelete = true;
            }
            else{
              this.model.CanDelete = false;
            }
            this.creatorImage = x.Task.CreatorImageName? this.hostUrl+x.Task.CreatorImagePath+x.Task.CreatorImageName
            :this.creatorImage;
            this.isLoaded = true;
          }
        }
        if(x.Comments){
          this.commentsModelList = x.Comments;
          this.commentsModelList.PageNumber ++;
          this.commentsModelList.Comments.forEach(x=>{
            x.CanDelete = this.setCanDeleteComment(x);
            x.FullUserImagePath =x.UserImageName? this.hostUrl + x.UserImagePath +x.UserImageName:this.defultImage;
          });
          this.comments = this.comments.concat(this.commentsModelList.Comments);
        }
      },
      error=>{
        this.isLoaded = true;
        this.errToaster.presentToast();
        console.log(error);
      }
    )
  }

  async deleteTaskAS(id) {
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
              this.router.navigate(['/project-details', this.model.ProjectId]);
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
  addComment(){
    if(this.commentModel.Text && this.commentModel.Text.trim()) {
      this.addingComment = true;
      this.taskService.AddComment(this.commentModel).subscribe(
        x=>{
          if(x.Id > 0){
            this.commentModel.Text = '';
            // this.scrollToBottom();
            this.scrollToTop();
            this.addingComment = false;
          }
        },
        error=>{
          console.log(error);
          this.errToaster.presentToast();
          this.addingComment = false;
        }
      )
    }
  }
  commentActionSubscribeEvent(){
    this.signalRService.getCommentActions()
    .subscribe(x =>{ 
      debugger;
      if(this.id == x.TaskId){
        let comment = x as TaskCommentModel;
        if(!comment.IsDeleted){
          comment.FullUserImagePath = comment.UserImageName? this.hostUrl + comment.UserImagePath +comment.UserImageName:this.defultImage;
          comment.CanDelete = this.setCanDeleteComment(comment);
          // this.comments.push(comment)
          this.comments.unshift(comment);
          this.currentThreadCount++;
        }
        else{
          debugger;
            this.comments = this.comments.filter(d=>d.Id != comment.Id);
            this.currentThreadCount--;
        }     
      }
    });
  }
  getComments(taskId:number,pageNumber:number,pageSize:number,event,currentThreadCount:number){
    this.getCommentsLoading = true;
    this.taskService.GetComments(taskId,pageNumber,pageSize,currentThreadCount).subscribe(
      x=>{
        debugger;
       this.commentsModelList = x;
       this.commentsModelList.PageNumber ++;
       this.commentsModelList.Comments.forEach(x=>         
        { 
          x.CanDelete = this.setCanDeleteComment(x);
          x.FullUserImagePath =x.UserImageName? this.hostUrl + x.UserImagePath +x.UserImageName:this.defultImage;
        }
        );
       this.comments = this.comments.concat(this.commentsModelList.Comments);
       if(event && this.commentsModelList.Comments.length < this.commentsModelList.PageSize){
          event.target.disabled = true;
       }
       this.getCommentsLoading = false;
      }
      ,error=>{
        this.getCommentsLoading = false;
        console.log(error);
      }
    );
  }
  loadComments(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();
      if(!this.getCommentsLoading){
        this.getComments(this.id,this.commentsModelList.PageNumber,this.commentsModelList.PageSize,event,this.currentThreadCount);
      }
    }, 500);
  }
  async deleteCommentAS(event, id: number) {
    event.stopPropagation();
    const actionSheet = await this.actionSheetController.create({
      header: 'Are you want to delete this comment?',
      mode: 'ios',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        handler: () => {
         this.taskService.DeleteComment(id).subscribe(data => {
           if(data) {
             this.comments = this.comments.filter(p => p.Id != data);
           }
         }, err => {
           if(err.status == 400) {
            console.log("Can't delete ths comment");
            this.errToaster.presentToast("Unable to delete comment.");
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
  setCanDeleteComment(comment:TaskCommentModel):boolean{
    if(comment.UserId == this.userId || this.model.CreatorId == this.userId){
      return true;
    }
    else{
      return false;
    }
  }

  scrollToBottom(): void {
    setTimeout(() => {
      this.ionContentTemplate.scrollToBottom(100);
    }, 100)
  }
  scrollToTop(): void {
    setTimeout(() => {
      this.ionContentTemplate.scrollToTop(100);
    }, 100)
  }
}
