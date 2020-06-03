export class TaskModel {
  Id : number;
  Title : string;
  Description : string;
  CreateDateTime : string;
  ProjectId : number;
  IsDeleted : boolean;
  CommentsCount : number;
  CreatorId : string;
  CreatorName : string;
  CreatorImageName:string;
  CreatorImagePath:string;
  CanDelete:boolean;
}