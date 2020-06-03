import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ProjectModel } from 'src/app/apiModels/ProjectModel';
import { map, tap } from 'rxjs/operators';
import { ProjectViewModel } from 'src/app/apiModels/ProjectViewModel';
import { ProjectsModelList } from 'src/app/apiModels/ProjectsModelList';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  apiProjectUrl = environment.apiURL + 'Project/';
  constructor(private httpClient: HttpClient) { }
  CreateProject(model:ProjectModel):Observable<ProjectModel>{
    const url = this.apiProjectUrl+"CreateProject";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',   
      })
    };
    return this.httpClient.post(url,model,httpOptions).pipe(
      map(x=>x as ProjectModel),
      tap(x=>x)
    )
  }
  GetProject(id:number,tasksPageSize:number = 0):Observable<ProjectViewModel>{
    const url = this.apiProjectUrl+"GetProject?id="+id+"&tasksPageSize="+tasksPageSize;
    return this.httpClient.get(url).pipe(
      map(x=>x as ProjectViewModel),
      tap(x=>x)
    )
  }
  GetProjects(pageNumber:number,pageSize:number):Observable<ProjectsModelList>{
    const url = this.apiProjectUrl+"GetProjects?pageSize="+pageSize+"&pageNumber="+pageNumber;
    return  this.httpClient.get(url).pipe(
      map(x=>x as ProjectsModelList),
      tap(x=>x)
    )
  }
  DeleteProject(id:number):Observable<number>{
    const url = this.apiProjectUrl+"DeleteProject?id="+id;
    return this.httpClient.get(url).pipe(
      map(x=>x as number),
      tap(x=>x)
    )
  }
}
