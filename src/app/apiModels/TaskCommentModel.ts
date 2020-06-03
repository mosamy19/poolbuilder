export class TaskCommentModel {
    Id:number; 
    Text : string;
    DateTime : Date;
    UserId : string;
    TaskId : number;
    IsDeleted : boolean;
    UserName : string;
    UserImageName : string;
    UserImagePath : string;
    FullUserImagePath:string;
    CanDelete:boolean;
}