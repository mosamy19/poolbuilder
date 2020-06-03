import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { LoginModel } from '../../apiModels/LoginModel';
import {map,tap} from 'rxjs/operators'; 
import { Observable } from 'rxjs';
import { AccountModel } from '../../apiModels/AccountModel';
import { LoginResponseModel } from 'src/app/apiModels/LoginResponseModel';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  apiAccountUrl = environment.apiURL + 'Account/';
  
  constructor(private httpClient: HttpClient) { }

  login(model: LoginModel): Observable<LoginResponseModel>{
    const url = this.apiAccountUrl + 'LoginByPhoneNumber'
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',   
      })
    };
    return this.httpClient.post<LoginResponseModel>(url, model,httpOptions).pipe(
      map(data=> data as LoginResponseModel),
      tap(data=>{
       console.log(data);
      },
      error=>{
       console.log(error)
      })
    );
  }
  logout(userId:string):Observable<string>{
    const url = this.apiAccountUrl +'Logout?userId='+userId;
    return this.httpClient.get(url).pipe(
      map(data=>data as string),
      tap(data=>{
        console.log(data);
      },error=>{
        console.log(error);
      })
    )
  }
  getLocalStorageAccount():AccountModel{
    let accountModel = null;
    let account = localStorage.getItem("account");
    if(account){
        accountModel = JSON.parse(account) as AccountModel;
    }
    return accountModel;
  }
  getLocalStorageUserId(){
    let id ="";
    let account = this.getLocalStorageAccount();
    if(account){
       id = account.Id;
    }
    return id;
  }
  setLocalStorageAccount(account:AccountModel){
    debugger;
    localStorage.setItem("account",JSON.stringify(account));
  }
  setLocalStorageToken(token:string){
    localStorage.setItem("access-token",token);
  }
  getLocalStorageToken():string{
    return localStorage.getItem("access-token");
  }
  setLocalStorageHasAccount(hasAccount:boolean){
    localStorage.setItem("hasAccount",hasAccount +"");
  }
  getLocalStorageHasAccount():boolean{
    let hasAccountStr =  localStorage.getItem("hasAccount");
    let hasAccount= false;
    if(hasAccountStr && hasAccountStr.toLowerCase() === "true"){
        hasAccount = true;
    }
    return hasAccount;
  }
  getAccountByPhoneNumber(phoneNumber: string): Observable<any>{
    debugger;
    const url = this.apiAccountUrl + 'GetAccountByPhoneNumber?phoneNumber='+phoneNumber;
    return this.httpClient.get(url).pipe(
      map(data=> data as AccountModel),
      tap(data=>{
         console.log(data);
      },
      error=>{
         console.log(error);
      })
    );
  }
  createAccount(model:AccountModel,photo:File):Observable<AccountModel>{
    const url = this.apiAccountUrl + 'CreateAccount'
   
    var formData = new FormData();
   // formData.append('model',JSON.stringify(model));
    formData.append('model.Id',model.Id);
    formData.append('model.Name',model.Name);
    formData.append('model.PhoneNumber',model.PhoneNumber);
    if(photo){     
      formData.append('file',photo,photo.name);
    }
    let headers = new HttpHeaders() ;
    // headers.append('Content-Type', 'json');  
    // headers.append('Accept', 'application/json');  
    //headers.append('enctype','multipart/form-data')
    let options = { headers: headers }; 
    return this.httpClient.post<AccountModel>(url,formData,options).pipe(
      map(data=> data as AccountModel),
      tap(data=>{
        console.log(data);
      },error=>{
        console.log(error);
      })
    )
  }
}
