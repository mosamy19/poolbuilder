import { TaskModel } from './TaskModel';

export class TaskModelList {
    Tasks : TaskModel [];
    PageNumber : number;
    PageSize : number;
    constructor(pageNumber:number,pageSize:number){
        this.PageNumber = pageNumber;
        this.PageSize = pageSize;
        this.Tasks = [];
    }
}