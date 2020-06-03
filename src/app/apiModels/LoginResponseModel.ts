import { AccountModel } from './AccountModel';

export class LoginResponseModel {
    Account : AccountModel;
    Token : string;
    HasAccount : boolean;
}