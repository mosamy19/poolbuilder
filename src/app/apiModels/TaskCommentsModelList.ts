import { TaskCommentModel } from './TaskCommentModel';

export class TaskCommentsModelList {
    Comments : TaskCommentModel [];
    PageNumber : number;
    PageSize : number;
    constructor(pageNumber:number,pageSize:number){
        this.PageNumber = pageNumber;
        this.PageSize = pageSize;
        this.Comments = [];
    }
}