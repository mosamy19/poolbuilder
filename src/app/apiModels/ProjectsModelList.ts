import { ProjectModel } from './ProjectModel';

export class ProjectsModelList{
    Projects : ProjectModel [];
    PageNumber : number;
    PageSize : number;
    constructor(pageNumber:number,pageSize:number){
        this.PageNumber = pageNumber;
        this.PageSize = pageSize;
        this.Projects = [];
    }
}