import { Injectable, EventEmitter } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { TaskCommentModel } from 'src/app/apiModels/TaskCommentModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentSignalRService {
  private hubConnection: signalR.HubConnection
  newCommentAction: EventEmitter<TaskCommentModel> = new EventEmitter();
  constructor() {
   }

   startConnection = () => {
     debugger
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl(environment.hostURL+ 'Task')
                            .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
    
  }
  stopConnection =() =>{
    this.hubConnection
    .stop()
    .then(() => console.log('Connection stopped'))
    .catch(err => console.log('Error while stop connection: ' + err))
  }

   addtransferCommentDataListener = () => {
    this.hubConnection.on('transferCommentData', (data) => {
      if(data){
        debugger;
        this.newCommentAction.emit(data);
      }
      console.log(data);
    });
  }
  getCommentActions(){
    return this.newCommentAction;
  }
}
