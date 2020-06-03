import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TaskModel } from 'src/app/apiModels/TaskModel';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TaskViewModel } from 'src/app/apiModels/TaskViewModel';
import { TaskModelList } from 'src/app/apiModels/TasksModelList';
import { TaskCommentModel } from 'src/app/apiModels/TaskCommentModel';
import { TaskCommentsModelList } from 'src/app/apiModels/TaskCommentsModelList';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  apiTaskUrl = environment.apiURL + 'Task/';
  constructor(private httpClient: HttpClient) { }
  AddTask(model:TaskModel):Observable<TaskModel>{
    const url = this.apiTaskUrl+"AddTask";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':'application/json',   
      })
    };
    return this.httpClient.post(url,model,httpOptions).pipe(
      map(x=>x as TaskModel),
      tap(x=>x)
    )
  }
  GetTask(id:number,commentsPageSize:number,currentThreadCount:number):Observable<TaskViewModel>{
    const url = this.apiTaskUrl+"GetTask?id="+id+"&commentsPageSize="+commentsPageSize;
    return this.httpClient.get(url).pipe(
      map(x=>x as TaskViewModel),
      tap(x=>x)
    )
  }
  GetTasks(projectId:number,pageNumber:number,pageSize:number):Observable<TaskModelList>{
    const url = this.apiTaskUrl+"GetTasks?projectId="+projectId+"&pageSize="+pageSize+"&pageNumber="+pageNumber;
    return  this.httpClient.get(url).pipe(
      map(x=>x as TaskModelList),
      tap(x=>x)
    )
  }
  DeleteTask(id:number):Observable<number>{
    const url = this.apiTaskUrl+"DeleteTask?id="+id;
    return this.httpClient.get(url).pipe(
      map(x=>x as number),
      tap(x=>x)
    )
  }
  AddComment(model:TaskCommentModel):Observable<TaskCommentModel>{
    const url = this.apiTaskUrl+"AddComment";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':'application/json',   
      })
    };
    return this.httpClient.post(url,model,httpOptions).pipe(
      map(x=>x as TaskCommentModel),
      tap(x=>x)
    )
  }
  GetComments(taskId:number,pageNumber:number,pageSize:number,currentThreadCount:number):Observable<TaskCommentsModelList>{
    const url = this.apiTaskUrl+"GetComments?taskId="+taskId+"&pageSize="+pageSize+"&pageNumber="+pageNumber+"&currentThreadCount="+currentThreadCount;
    return  this.httpClient.get(url).pipe(
      map(x=>x as TaskCommentsModelList),
      tap(x=>x)
    )
  }
  DeleteComment(id:number):Observable<number>{
    const url = this.apiTaskUrl+"DeleteComment?id="+id;
    return this.httpClient.get(url).pipe(
      map(x=>x as number),
      tap(x=>x)
    )
  }
}
